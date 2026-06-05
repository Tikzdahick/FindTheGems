// Vercel serverless function — GET /api/spotify-token
// Exchanges Spotify Client Credentials for a Bearer token server-side.
// The client secret never leaves the server.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const id     = process.env.VITE_SPOTIFY_CLIENT_ID;
  const secret = process.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!id || !secret) {
    return res.status(500).json({ error: 'Spotify env vars not set on server' });
  }

  const r = await fetch('https://accounts.spotify.com/api/token', {
    method:  'POST',
    headers: {
      Authorization:  'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const body = await r.json();
  if (!r.ok) return res.status(r.status).json({ error: 'Spotify auth failed', detail: body });

  // Cache the token at the CDN — tokens last 3600s, we cache for 3000s
  res.setHeader('Cache-Control', 'public, s-maxage=3000, stale-while-revalidate=60');
  return res.status(200).json({
    access_token: body.access_token,
    expires_in:   body.expires_in,
  });
}
