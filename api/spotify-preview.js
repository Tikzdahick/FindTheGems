// Vercel serverless function — GET /api/spotify-preview?title=...&artist=...
// Searches Spotify for a track and returns its 30-second preview_url.
// All Spotify API calls happen server-side — no CORS issues, no secrets in browser.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { title, artist } = req.query;
  if (!title) return res.status(400).json({ error: 'title query param required' });

  const id     = process.env.VITE_SPOTIFY_CLIENT_ID;
  const secret = process.env.VITE_SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) {
    return res.status(500).json({ error: 'Spotify env vars not set on server' });
  }

  // ── 1. Get access token ───────────────────────────────────────────────────
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method:  'POST',
    headers: {
      Authorization:  'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const tokenBody = await tokenRes.json();
  if (!tokenRes.ok || !tokenBody.access_token) {
    return res.status(tokenRes.status).json({ error: 'Spotify auth failed' });
  }
  const token = tokenBody.access_token;

  // ── 2. Search for the track ───────────────────────────────────────────────
  const q    = artist ? `track:"${title}" artist:"${artist}"` : `track:"${title}"`;
  const url  = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5&market=US`;
  const srch = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await srch.json();

  if (!srch.ok) {
    return res.status(srch.status).json({ error: 'Spotify search failed', detail: data });
  }

  const items = data.tracks?.items || [];

  // Prefer exact title+artist match; fall back to any result with a preview
  const exact   = items.find(t =>
    t.name.toLowerCase() === title.toLowerCase() &&
    t.artists.some(a =>
      (artist || '').toLowerCase().includes(a.name.toLowerCase()) ||
      a.name.toLowerCase().includes((artist || '').toLowerCase())
    )
  );
  const withPrev = items.find(t => t.preview_url);
  const match    = (exact?.preview_url ? exact : null) || withPrev || exact || items[0];

  const preview_url  = match?.preview_url || null;
  const track_name   = match?.name || null;
  const track_artist = match?.artists?.[0]?.name || null;

  // Cache successful responses for 24 hours (preview URLs are stable)
  if (preview_url) {
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
  }

  return res.status(200).json({ preview_url, track_name, track_artist });
}
