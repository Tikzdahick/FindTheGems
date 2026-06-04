// ── Genres & Moods ────────────────────────────────────────────────────────────
export const ALL_GENRES = [
  { id: 'bedroom-pop',  label: 'Bedroom Pop', emoji: '🛏️' },
  { id: 'lo-fi',        label: 'Lo-Fi',        emoji: '📻' },
  { id: 'indie-folk',   label: 'Indie Folk',   emoji: '🌿' },
  { id: 'neo-soul',     label: 'Neo-Soul',     emoji: '✨' },
  { id: 'dark-wave',    label: 'Dark Wave',    emoji: '🌊' },
  { id: 'hip-hop',      label: 'Hip-Hop',      emoji: '🎤' },
  { id: 'ambient',      label: 'Ambient',      emoji: '🌌' },
  { id: 'r-and-b',      label: 'R&B',          emoji: '💜' },
  { id: 'jazz',         label: 'Jazz',         emoji: '🎷' },
  { id: 'electronic',   label: 'Electronic',   emoji: '⚡' },
  { id: 'punk',         label: 'Punk',         emoji: '🔥' },
  { id: 'dream-pop',    label: 'Dream Pop',    emoji: '🌙' },
  { id: 'emo',          label: 'Emo',          emoji: '🖤' },
  { id: 'afrobeats',    label: 'Afrobeats',    emoji: '🥁' },
  { id: 'bossa-nova',   label: 'Bossa Nova',   emoji: '🎸' },
];

export const ALL_MOODS = [
  { id: 'chill',       label: 'Chill',       emoji: '😌' },
  { id: 'hype',        label: 'Hype',        emoji: '🔥' },
  { id: 'melancholic', label: 'Melancholic', emoji: '🌧️' },
  { id: 'euphoric',    label: 'Euphoric',    emoji: '✨' },
  { id: 'focused',     label: 'Focused',     emoji: '🎯' },
  { id: 'late-night',  label: 'Late Night',  emoji: '🌙' },
  { id: 'feel-good',   label: 'Feel Good',   emoji: '☀️' },
  { id: 'sad-hours',   label: 'Sad Hours',   emoji: '💔' },
];

// ── Artists ───────────────────────────────────────────────────────────────────
// Schema: { id, name, photo, monthlyListeners, bio, genres: string[], social: { spotify, appleMusic, soundcloud, instagram, tiktok } }
export const artists = [];

// ── Songs ─────────────────────────────────────────────────────────────────────
// Schema: { id, title, artistId, genre, mood, monthlyListeners, coverArt }
export const songs = [];

// ── Community posts ───────────────────────────────────────────────────────────
// Schema: { id, songName, artist, coverArt, submitter, reason, upvotes, downvotes, userVote, commentCount }
export const initialCommunityPosts = [];

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getArtistById    = (id) => artists.find((a) => a.id === id);
export const getSongsByArtist = (artistId) => songs.filter((s) => s.artistId === artistId);

export function formatListeners(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function avatarColor(username = '') {
  const palette = ['#7c3aed','#2563eb','#db2777','#059669','#d97706','#0891b2','#dc2626'];
  const idx = [...username].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}
