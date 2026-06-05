// All Spotify API calls go through Vercel serverless functions (/api/*).
// The browser never talks to Spotify directly — no CORS issues, no secrets.

// isConfigured is always true: the serverless functions exist at runtime.
// They will return 500 if the Vercel env vars haven't been set yet.
export const isConfigured = () => true;

// ── Token (cached in memory for the session) ──────────────────────────────────
let _token  = null;
let _expiry = 0;

async function getToken() {
  if (_token && Date.now() < _expiry) return _token;

  console.log('[Spotify] Fetching token via /api/spotify-token…');
  const res = await fetch('/api/spotify-token');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`/api/spotify-token returned ${res.status}: ${err.error || res.statusText}`);
  }
  const { access_token, expires_in } = await res.json();
  if (!access_token) throw new Error('No access_token in /api/spotify-token response');

  _token  = access_token;
  _expiry = Date.now() + ((expires_in || 3600) - 60) * 1000;
  console.log('[Spotify] Token ready, valid for', expires_in, 's');
  return _token;
}

// Raw Spotify API — used for search/artist calls
async function spotifyAPI(path) {
  const token = await getToken();
  const res   = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify ${res.status}: ${path}`);
  return res.json();
}

// ── Preview URL cache (session) ───────────────────────────────────────────────
const _previewCache = new Map();

// Calls /api/spotify-preview (serverless) — no CORS, no browser secret exposure.
export async function searchTrackPreview(title, artist) {
  const key = `${title.toLowerCase()}::${(artist || '').toLowerCase()}`;
  if (_previewCache.has(key)) {
    const cached = _previewCache.get(key);
    console.log(`[Spotify] Cache hit "${title}" →`, cached ?? 'null (no Spotify preview)');
    return cached;
  }

  console.log(`[Spotify] Requesting preview for "${title}" by "${artist}" via /api/spotify-preview`);
  try {
    const params = new URLSearchParams({ title, ...(artist ? { artist } : {}) });
    const res    = await fetch(`/api/spotify-preview?${params}`);
    if (!res.ok) throw new Error(`/api/spotify-preview returned ${res.status}`);

    const { preview_url } = await res.json();
    console.log(`[Spotify] Preview for "${title}":`, preview_url ?? 'null (Spotify has no preview for this track)');
    _previewCache.set(key, preview_url || null);
    return preview_url || null;
  } catch (err) {
    console.warn(`[Spotify] searchTrackPreview error for "${title}":`, err.message);
    _previewCache.set(key, null);
    return null;
  }
}

// ── Mapping helpers ───────────────────────────────────────────────────────────
const GENRE_SEEDS = {
  'Bedroom Pop': 'indie-pop', 'Lo-Fi': 'chill',   'Indie Folk': 'folk',
  'Neo-Soul': 'soul',         'Dark Wave': 'goth', 'Hip-Hop': 'hip-hop',
  'Ambient': 'ambient',       'R&B': 'r-n-b',      'Jazz': 'jazz',
  'Electronic': 'electronic', 'Punk': 'punk',      'Dream Pop': 'indie-pop',
  'Emo': 'emo', 'Afrobeats': 'afrobeat', 'Bossa Nova': 'bossanova',
};

const SP_GENRE_MAP = {
  'indie': 'Indie Folk', 'folk': 'Indie Folk', 'indie pop': 'Bedroom Pop',
  'bedroom pop': 'Bedroom Pop', 'lo-fi': 'Lo-Fi', 'chill': 'Lo-Fi',
  'soul': 'Neo-Soul', 'neo soul': 'Neo-Soul', 'hip hop': 'Hip-Hop',
  'hip-hop': 'Hip-Hop', 'rap': 'Hip-Hop', 'ambient': 'Ambient',
  'electronic': 'Electronic', 'punk': 'Punk', 'emo': 'Emo',
  'r&b': 'R&B', 'jazz': 'Jazz', 'afrobeat': 'Afrobeats',
  'bossa nova': 'Bossa Nova', 'dark wave': 'Dark Wave', 'goth': 'Dark Wave',
  'dream pop': 'Dream Pop',
};

const GENRE_MOOD_MAP = {
  'ambient': 'Chill', 'chill': 'Chill', 'lo-fi': 'Chill', 'bossanova': 'Chill',
  'folk': 'Melancholic', 'emo': 'Melancholic',
  'indie-pop': 'Dreamy', 'dream-pop': 'Dreamy',
  'soul': 'Feel Good', 'jazz': 'Feel Good',
  'hip-hop': 'Hype', 'punk': 'Hype', 'afrobeat': 'Hype',
  'r-n-b': 'Late Night', 'goth': 'Late Night', 'electronic': 'Focused',
};

function mapGenre(genres = []) {
  for (const g of genres) {
    const l = g.toLowerCase();
    for (const [k, v] of Object.entries(SP_GENRE_MAP)) {
      if (l.includes(k)) return v;
    }
  }
  return genres[0] ? genres[0].split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : 'Electronic';
}

function mapMood(genres = []) {
  for (const g of genres) {
    const l = g.toLowerCase();
    for (const [k, v] of Object.entries(GENRE_MOOD_MAP)) {
      if (l.includes(k)) return v;
    }
  }
  return 'Chill';
}

function popToListeners(pop = 0) {
  return Math.round(100 * Math.pow(10, (pop / 100) * 4.5));
}

export function listenersToPop(n) {
  if (n <= 0) return 0;
  if (n >= 10_000_000) return 100;
  return Math.round((Math.log10(n / 100) / 4.5) * 100);
}

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
  const genreList = (artist.genres || []).slice(0, 3)
    .map(g => g.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' '));
  return {
    id:               `sp_${artist.id}`,
    name:             artist.name,
    photo:            artist.images?.[0]?.url || '',
    monthlyListeners: popToListeners(artist.popularity || 0),
    bio:              `${artist.name} has ${(artist.followers?.total || 0).toLocaleString()} followers on Spotify. ${(artist.popularity || 0) > 60 ? 'Their sound is gaining serious momentum.' : 'Still largely undiscovered — you found them early.'}`,
    genres:           genreList,
    social:           { spotify: `https://open.spotify.com/artist/${artist.id}`, appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
    spotifyId:        artist.id,
    popularity:       artist.popularity || 0,
    followers:        artist.followers?.total || 0,
  };
}

async function batchArtistGenres(artistIds) {
  if (!artistIds.length) return {};
  const ids  = [...new Set(artistIds)].slice(0, 20).join(',');
  const data = await spotifyAPI(`/artists?ids=${ids}`);
  return Object.fromEntries((data.artists || []).map(a => [a.id, a.genres || []]));
}

// Discover feed (underrated tracks from Spotify search)
export async function fetchDiscoverTracks(selectedAppGenres = [], maxPop = 50, count = 20) {
  const seeds = selectedAppGenres.length
    ? [...new Set(selectedAppGenres.map(g => GENRE_SEEDS[g]).filter(Boolean))].slice(0, 4)
    : ['indie-pop', 'chill', 'r-n-b', 'ambient'];

  const all     = [];
  const perSeed = Math.ceil(count / seeds.length);
  for (const seed of seeds) {
    try {
      const d = await spotifyAPI(`/search?q=genre:${seed}&type=track&market=US&limit=50`);
      all.push(...(d.tracks?.items || []).filter(t => t.popularity > 3 && t.popularity <= maxPop).slice(0, perSeed));
    } catch {}
  }

  const genreMap = await batchArtistGenres(all.map(t => t.artists[0].id)).catch(() => ({}));
  const seen = new Set();
  return all
    .filter(t => { if (seen.has(t.id)) return false; seen.add(t.id); return true; })
    .map(t => trackToSong(t, genreMap[t.artists[0].id] || []))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// Search tab
export async function searchSpotifyTracks(query, minL = 0, maxL = 10_000_000, limit = 30) {
  const q      = query?.trim() || 'year:2020-2024';
  const minPop = listenersToPop(minL);
  const maxPop = listenersToPop(maxL);
  const d      = await spotifyAPI(`/search?q=${encodeURIComponent(q)}&type=track&market=US&limit=50`);
  const items  = (d.tracks?.items || []).filter(t => t.popularity >= minPop && t.popularity <= maxPop).slice(0, limit);
  const gMap   = await batchArtistGenres(items.map(t => t.artists[0].id)).catch(() => ({}));
  return items.map(t => trackToSong(t, gMap[t.artists[0].id] || []));
}

// Artist profile page
export async function fetchArtistProfile(spotifyId) {
  const [artist, top] = await Promise.all([
    spotifyAPI(`/artists/${spotifyId}`),
    spotifyAPI(`/artists/${spotifyId}/top-tracks?market=US`),
  ]);
  return { profile: artistToProfile(artist), songs: (top.tracks || []).slice(0, 5).map(t => trackToSong(t, artist.genres || [])) };
}

// Artist profile photo (640px)
export async function fetchArtistPhoto(spotifyId) {
  try {
    const a = await spotifyAPI(`/artists/${spotifyId}`);
    return a.images?.[0]?.url || null;
  } catch { return null; }
}
