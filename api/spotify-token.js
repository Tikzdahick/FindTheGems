// Vercel serverless function — POST /api/spotify-token
// Exchanges Spotify Client Credentials for an access token server-side,
// keeping the client secret out of the browser bundle.
// Called by src/utils/spotify.js in production.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  const CLIENT_ID     = process.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.VITE_SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('[spotify-token] Missing env vars');
    return res.status(500).json({ error: 'Spotify credentials not configured on server' });
  }

  try {
    const spotifyRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!spotifyRes.ok) {
      const text = await spotifyRes.text();
      console.error('[spotify-token] Spotify returned', spotifyRes.status, text);
      return res.status(spotifyRes.status).json({ error: 'Spotify auth failed', detail: text });
    }

    const { access_token, expires_in, token_type } = await spotifyRes.json();

    // Cache at the CDN level for slightly less than the token TTL
    res.setHeader('Cache-Control', 'public, s-maxage=3000, stale-while-revalidate=60');
    return res.status(200).json({ access_token, expires_in, token_type });
  } catch (err) {
    console.error('[spotify-token] Error:', err.message);
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
}
