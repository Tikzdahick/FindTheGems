// Spotify Web API — Client Credentials flow.
// In production (Vercel): token is fetched via /api/spotify-token (serverless),
// keeping the client secret out of the browser bundle.
// In development: falls back to direct Spotify auth using .env credentials.

const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID     || '';
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';
const PLACEHOLDER   = 'your_spotify_client_id_here';

// Production always tries the serverless function.
// Dev falls back to direct credentials from .env.
export const isConfigured = () => {
  if (import.meta.env.PROD) return true;
  return !!(CLIENT_ID && CLIENT_SECRET && CLIENT_ID !== PLACEHOLDER);
};

// ── Token cache ───────────────────────────────────────────────────────────────
let _token  = null;
let _expiry = 0;

async function getToken() {
  if (_token && Date.now() < _expiry) {
    console.log('[Spotify] Using cached token, expires in', Math.round((_expiry - Date.now()) / 1000), 's');
    return _token;
  }

  let d;

  if (import.meta.env.PROD) {
    // Production: use serverless function (secret stays server-side)
    console.log('[Spotify] Fetching token via /api/spotify-token');
    const res = await fetch('/api/spotify-token');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Token endpoint ${res.status}: ${err.error || 'unknown'}`);
    }
    d = await res.json();
  } else if (CLIENT_ID && CLIENT_SECRET && CLIENT_ID !== PLACEHOLDER) {
    // Development: direct Spotify auth (CORS is permitted by Spotify for this endpoint)
    console.log('[Spotify] Dev mode — fetching token directly from Spotify');
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) throw new Error(`Spotify auth ${res.status}`);
    d = await res.json();
  } else {
    throw new Error('No Spotify credentials available (set VITE_SPOTIFY_CLIENT_ID/.SECRET in .env)');
  }

  if (!d?.access_token) throw new Error('Spotify returned no access_token: ' + JSON.stringify(d));

  _token  = d.access_token;
  _expiry = Date.now() + ((d.expires_in || 3600) - 60) * 1000;
  console.log('[Spotify] Token obtained, valid for', d.expires_in, 's');
  return _token;
}

async function api(path) {
  const token = await getToken();
  const res   = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify ${res.status}: ${path}`);
  return res.json();
}

// ── Genre / mood mapping ──────────────────────────────────────────────────────
const GENRE_SEEDS = {
  'Bedroom Pop': 'indie-pop',  'Lo-Fi': 'chill',     'Indie Folk': 'folk',
  'Neo-Soul':    'soul',       'Dark Wave': 'goth',   'Hip-Hop': 'hip-hop',
  'Ambient':     'ambient',    'R&B': 'r-n-b',        'Jazz': 'jazz',
  'Electronic':  'electronic', 'Punk': 'punk',        'Dream Pop': 'indie-pop',
  'Emo':         'emo',        'Afrobeats': 'afrobeat', 'Bossa Nova': 'bossanova',
};

const SPOTIFY_TO_APP_GENRE = {
  'indie': 'Indie Folk', 'folk': 'Indie Folk', 'indie pop': 'Bedroom Pop',
  'bedroom pop': 'Bedroom Pop', 'lo-fi': 'Lo-Fi', 'chill': 'Lo-Fi',
  'soul': 'Neo-Soul', 'neo soul': 'Neo-Soul', 'hip hop': 'Hip-Hop',
  'hip-hop': 'Hip-Hop', 'rap': 'Hip-Hop', 'ambient': 'Ambient',
  'electronic': 'Electronic', 'edm': 'Electronic', 'punk': 'Punk',
  'emo': 'Emo', 'r&b': 'R&B', 'jazz': 'Jazz', 'afrobeat': 'Afrobeats',
  'bossa nova': 'Bossa Nova', 'dark wave': 'Dark Wave', 'goth': 'Dark Wave',
  'dream pop': 'Dream Pop',
};

const GENRE_TO_MOOD = {
  'ambient': 'Chill', 'chill': 'Chill', 'lo-fi': 'Chill', 'bossanova': 'Chill',
  'folk': 'Melancholic', 'emo': 'Melancholic', 'sad': 'Melancholic',
  'indie-pop': 'Dreamy', 'dream-pop': 'Dreamy',
  'soul': 'Feel Good', 'jazz': 'Feel Good',
  'hip-hop': 'Hype', 'punk': 'Hype', 'afrobeat': 'Hype',
  'r-n-b': 'Late Night', 'goth': 'Late Night', 'electronic': 'Focused',
};

function mapGenre(spotifyGenres = []) {
  for (const g of spotifyGenres) {
    const lower = g.toLowerCase();
    for (const [key, val] of Object.entries(SPOTIFY_TO_APP_GENRE)) {
      if (lower.includes(key)) return val;
    }
  }
  return spotifyGenres[0]
    ? spotifyGenres[0].split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'Electronic';
}

function mapMood(spotifyGenres = []) {
  for (const g of spotifyGenres) {
    const lower = g.toLowerCase();
    for (const [key, val] of Object.entries(GENRE_TO_MOOD)) {
      if (lower.includes(key)) return val;
    }
  }
  return 'Chill';
}

function popToListeners(pop) {
  if (!pop) return 0;
  return Math.round(100 * Math.pow(10, (pop / 100) * 4.5));
}

export function listenersToPop(n) {
  if (n <= 0) return 0;
  if (n >= 10_000_000) return 100;
  return Math.round((Math.log10(n / 100) / 4.5) * 100);
}

// ── Data transformers ─────────────────────────────────────────────────────────
export function trackToSong(track, artistGenres = []) {
  return {
    id:               `sp_${track.id}`,
    title:            track.name,
    artistId:         `sp_${track.artists[0].id}`,
    genre:            mapGenre(artistGenres),
    mood:             mapMood(artistGenres),
    monthlyListeners: popToListeners(track.popularity),
    coverArt:         track.album.images[0]?.url || '',
    previewUrl:       track.preview_url || null,
    spotifyId:        track.id,
    artistSpotifyId:  track.artists[0].id,
    artistName:       track.artists[0].name,
    albumName:        track.album.name,
    popularity:       track.popularity,
  };
}

export function artistToProfile(artist) {
  const genreList = (artist.genres || []).slice(0, 3).map(
    g => g.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  );
  return {
    id:               `sp_${artist.id}`,
    name:             artist.name,
    photo:            artist.images?.[0]?.url || '',
    monthlyListeners: popToListeners(artist.popularity || 0),
    bio: [
      `${artist.name} is ${genreList.length ? `a ${genreList.slice(0, 2).join(' / ')} artist` : 'an artist'}`,
      `with ${(artist.followers?.total || 0).toLocaleString()} followers on Spotify.`,
      (artist.popularity || 0) > 60
        ? 'Their sound has been gaining serious momentum.'
        : 'Still largely undiscovered — you found them early.',
    ].join(' '),
    genres:    genreList,
    social:    { spotify: `https://open.spotify.com/artist/${artist.id}`, appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
    spotifyId: artist.id,
    popularity: artist.popularity || 0,
    followers:  artist.followers?.total || 0,
  };
}

// ── Preview URL cache (in-memory, session-scoped) ─────────────────────────────
const _previewCache = new Map();

// Search Spotify for a specific track and return its 30-second preview URL.
// Logs results so they're visible in the browser console for debugging.
export async function searchTrackPreview(title, artistName) {
  const key = `${title.toLowerCase()}::${(artistName || '').toLowerCase()}`;
  if (_previewCache.has(key)) {
    const cached = _previewCache.get(key);
    console.log(`[Spotify] Preview cache hit for "${title}" →`, cached ?? 'null (no preview on Spotify)');
    return cached;
  }

  console.log(`[Spotify] Searching preview for "${title}" by "${artistName}"`);
  try {
    const q    = artistName ? `track:"${title}" artist:"${artistName}"` : `track:"${title}"`;
    const data = await api(`/search?q=${encodeURIComponent(q)}&type=track&limit=5&market=US`);
    const items = data.tracks?.items || [];

    const exact = items.find(t =>
      t.name.toLowerCase() === title.toLowerCase() &&
      t.artists.some(a =>
        (artistName || '').toLowerCase().includes(a.name.toLowerCase()) ||
        a.name.toLowerCase().includes((artistName || '').toLowerCase())
      )
    );
    const match = exact || items.find(t => t.preview_url) || items[0];
    const url   = match?.preview_url || null;

    console.log(`[Spotify] Preview for "${title}": ${url ? url.slice(0, 60) + '…' : 'null — Spotify has no preview for this track'}`);
    _previewCache.set(key, url);
    return url;
  } catch (err) {
    console.warn(`[Spotify] searchTrackPreview failed for "${title}":`, err.message);
    _previewCache.set(key, null);
    return null;
  }
}

// ── Batch artist fetch ────────────────────────────────────────────────────────
async function batchArtistGenres(artistIds) {
  if (!artistIds.length) return {};
  const ids  = [...new Set(artistIds)].slice(0, 20).join(',');
  const data = await api(`/artists?ids=${ids}`);
  return Object.fromEntries((data.artists || []).map(a => [a.id, a.genres || []]));
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchDiscoverTracks(selectedAppGenres = [], maxPop = 50, count = 20) {
  const seeds = selectedAppGenres.length
    ? [...new Set(selectedAppGenres.map(g => GENRE_SEEDS[g]).filter(Boolean))].slice(0, 4)
    : ['indie-pop', 'chill', 'r-n-b', 'ambient'];

  const allTracks = [];
  const perSeed   = Math.ceil(count / seeds.length);

  for (const seed of seeds) {
    try {
      const data     = await api(`/search?q=genre:${seed}&type=track&market=US&limit=50`);
      const filtered = (data.tracks?.items || []).filter(t => t.popularity > 3 && t.popularity <= maxPop);
      allTracks.push(...filtered.slice(0, perSeed));
    } catch { /* skip failed genre */ }
  }

  const artistIds = allTracks.map(t => t.artists[0].id);
  const genreMap  = await batchArtistGenres(artistIds).catch(() => ({}));

  const seen  = new Set();
  return allTracks
    .filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; })
    .map(t => trackToSong(t, genreMap[t.artists[0].id] || []))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export async function searchSpotifyTracks(query, minListeners = 0, maxListeners = 10_000_000, limit = 30) {
  const q      = query?.trim() || 'year:2020-2024';
  const minPop = listenersToPop(minListeners);
  const maxPop = listenersToPop(maxListeners);

  const data     = await api(`/search?q=${encodeURIComponent(q)}&type=track&market=US&limit=50`);
  const filtered = (data.tracks?.items || [])
    .filter(t => t.popularity >= minPop && t.popularity <= maxPop)
    .slice(0, limit);

  const genreMap = await batchArtistGenres(filtered.map(t => t.artists[0].id)).catch(() => ({}));
  return filtered.map(t => trackToSong(t, genreMap[t.artists[0].id] || []));
}

export async function fetchArtistProfile(spotifyId) {
  const [artist, topData] = await Promise.all([
    api(`/artists/${spotifyId}`),
    api(`/artists/${spotifyId}/top-tracks?market=US`),
  ]);
  const profile = artistToProfile(artist);
  const songs   = (topData.tracks || []).slice(0, 5).map(t => trackToSong(t, artist.genres || []));
  return { profile, songs };
}

// Fetch only the high-res (640px) artist photo — Client Credentials returns
// name + images but NOT followers/genres/popularity (Spotify API restriction).
export async function fetchArtistPhoto(spotifyId) {
  try {
    const artist = await api(`/artists/${spotifyId}`);
    return artist.images?.[0]?.url || null;
  } catch {
    return null;
  }
}
