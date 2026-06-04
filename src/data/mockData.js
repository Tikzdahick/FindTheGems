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
  { id: 'chill',      label: 'Chill',      emoji: '😌' },
  { id: 'hype',       label: 'Hype',       emoji: '🔥' },
  { id: 'melancholic',label: 'Melancholic',emoji: '🌧️' },
  { id: 'euphoric',   label: 'Euphoric',   emoji: '✨' },
  { id: 'focused',    label: 'Focused',    emoji: '🎯' },
  { id: 'late-night', label: 'Late Night', emoji: '🌙' },
  { id: 'feel-good',  label: 'Feel Good',  emoji: '☀️' },
  { id: 'sad-hours',  label: 'Sad Hours',  emoji: '💔' },
];

// ── Artists ───────────────────────────────────────────────────────────────────
export const artists = [
  {
    id: 'a1',
    name: 'Clairo',
    photo: 'https://picsum.photos/seed/artist-clairo/300/300',
    monthlyListeners: 1_240_000,
    bio: 'Bedroom pop artist from Atlanta known for her lo-fi, dreamy sound and deeply personal lyrics. Started posting music to YouTube from her childhood bedroom.',
    genres: ['Bedroom Pop', 'Dream Pop'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a2',
    name: 'Sable & Shore',
    photo: 'https://picsum.photos/seed/artist-sable/300/300',
    monthlyListeners: 12400,
    bio: 'A duo from Portland crafting atmospheric folk with oceanic textures. Their debut EP was recorded entirely in a lighthouse off the Oregon coast.',
    genres: ['Indie Folk', 'Ambient'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a3',
    name: 'Nxte Wave',
    photo: 'https://picsum.photos/seed/artist-nxte/300/300',
    monthlyListeners: 387000,
    bio: 'Producer and rapper from Chicago blending neo-soul and trap with jazz influences. Every beat is handcrafted using vintage synthesizers and live instrumentation.',
    genres: ['Hip-Hop', 'Neo-Soul'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a4',
    name: 'Luna Vex',
    photo: 'https://picsum.photos/seed/artist-luna/300/300',
    monthlyListeners: 54300,
    bio: 'Dark electronic artist from Berlin. Her music is a cinematic journey through synthesized soundscapes, glitchy percussion, and haunting vocals.',
    genres: ['Dark Wave', 'Electronic'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a5',
    name: 'Mellow Earth',
    photo: 'https://picsum.photos/seed/artist-mellow/300/300',
    monthlyListeners: 2_800_000,
    bio: 'Soul quartet from New Orleans channeling the warmth of vintage R&B. Known for their intricate vocal harmonies and lush acoustic arrangements.',
    genres: ['Neo-Soul', 'R&B'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a6',
    name: 'Marigold Sloane',
    photo: 'https://picsum.photos/seed/artist-marigold/300/300',
    monthlyListeners: 31000,
    bio: 'Dream pop songwriter from Melbourne. She writes songs in her sleep and records them before she forgets — you can hear the haziness in every track.',
    genres: ['Dream Pop', 'Lo-Fi'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a7',
    name: 'Tokyo Rain',
    photo: 'https://picsum.photos/seed/artist-tokyo/300/300',
    monthlyListeners: 67000,
    bio: 'Anonymous ambient producer whose identity remains a mystery. Every release comes with hand-drawn artwork and coordinates to a location in Japan.',
    genres: ['Ambient', 'Electronic'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a8',
    name: 'OZMA',
    photo: 'https://picsum.photos/seed/artist-ozma/300/300',
    monthlyListeners: 45000,
    bio: 'Jazz-fusion collective from Lagos blending West African rhythms with modern jazz harmony. Their live sets are legendary — no two shows are ever the same.',
    genres: ['Jazz', 'Afrobeats'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a9',
    name: 'Pale Ember',
    photo: 'https://picsum.photos/seed/artist-pale/300/300',
    monthlyListeners: 5_800,
    bio: 'Emo-folk songwriter from Nashville writing about small-town escape, old loves, and cheap diners at 3am. Plays every instrument herself.',
    genres: ['Emo', 'Indie Folk'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a10',
    name: 'Vida Morada',
    photo: 'https://picsum.photos/seed/artist-vida/300/300',
    monthlyListeners: 19000,
    bio: 'Bossa nova and R&B hybrid from São Paulo. Her voice has been described as "liquid gold at midnight" — minimal production, maximum feeling.',
    genres: ['Bossa Nova', 'R&B'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a11',
    name: 'Haze District',
    photo: 'https://picsum.photos/seed/artist-haze/300/300',
    monthlyListeners: 6_200_000,
    bio: 'Dark wave duo from Manchester making gothic synth music for people who miss the 80s but have never been there. Cold, cinematic, and utterly hypnotic.',
    genres: ['Dark Wave', 'Punk'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
  {
    id: 'a12',
    name: 'The Glassworks',
    photo: 'https://picsum.photos/seed/artist-glass/300/300',
    monthlyListeners: 4_500_000,
    bio: 'Post-punk quartet from Dublin with a sound somewhere between Wire and Fontaines D.C. Loud, angular, and deeply melodic.',
    genres: ['Punk', 'Indie Folk'],
    social: { spotify: '#', appleMusic: '#', soundcloud: '#', instagram: '#', tiktok: '#' },
  },
];

// ── Songs ─────────────────────────────────────────────────────────────────────
export const songs = [
  { id: 's1',  title: 'Softly Burning',    artistId: 'a1',  genre: 'Bedroom Pop', mood: 'Chill',       monthlyListeners: 1_240_000, coverArt: 'https://picsum.photos/seed/song-1/400/400'  },
  { id: 's2',  title: 'Paper Moon',         artistId: 'a1',  genre: 'Dream Pop',   mood: 'Dreamy',      monthlyListeners: 1_240_000, coverArt: 'https://picsum.photos/seed/song-2/400/400'  },
  { id: 's3',  title: 'Tide & Timber',      artistId: 'a2',  genre: 'Indie Folk',  mood: 'Melancholic', monthlyListeners: 12_400,    coverArt: 'https://picsum.photos/seed/song-3/400/400'  },
  { id: 's4',  title: 'Driftwood Dreams',   artistId: 'a2',  genre: 'Ambient',     mood: 'Chill',       monthlyListeners: 12_400,    coverArt: 'https://picsum.photos/seed/song-4/400/400'  },
  { id: 's5',  title: 'Gold Rush',          artistId: 'a3',  genre: 'Hip-Hop',     mood: 'Hype',        monthlyListeners: 387_000,   coverArt: 'https://picsum.photos/seed/song-5/400/400'  },
  { id: 's6',  title: 'Velvet Chains',      artistId: 'a3',  genre: 'Neo-Soul',    mood: 'Late Night',  monthlyListeners: 387_000,   coverArt: 'https://picsum.photos/seed/song-6/400/400'  },
  { id: 's7',  title: 'Static Mind',        artistId: 'a4',  genre: 'Dark Wave',   mood: 'Late Night',  monthlyListeners: 54_300,    coverArt: 'https://picsum.photos/seed/song-7/400/400'  },
  { id: 's8',  title: 'Neon Abyss',         artistId: 'a4',  genre: 'Electronic',  mood: 'Focused',     monthlyListeners: 54_300,    coverArt: 'https://picsum.photos/seed/song-8/400/400'  },
  { id: 's9',  title: 'Warm Honey',         artistId: 'a5',  genre: 'Neo-Soul',    mood: 'Feel Good',   monthlyListeners: 2_800_000, coverArt: 'https://picsum.photos/seed/song-9/400/400'  },
  { id: 's10', title: 'River Run',          artistId: 'a5',  genre: 'R&B',         mood: 'Chill',       monthlyListeners: 2_800_000, coverArt: 'https://picsum.photos/seed/song-10/400/400' },
  { id: 's11', title: 'Cotton Clouds',      artistId: 'a6',  genre: 'Dream Pop',   mood: 'Dreamy',      monthlyListeners: 31_000,    coverArt: 'https://picsum.photos/seed/song-11/400/400' },
  { id: 's12', title: 'Slow Motion Film',   artistId: 'a6',  genre: 'Lo-Fi',       mood: 'Chill',       monthlyListeners: 31_000,    coverArt: 'https://picsum.photos/seed/song-12/400/400' },
  { id: 's13', title: 'Night Protocol',     artistId: 'a7',  genre: 'Ambient',     mood: 'Focused',     monthlyListeners: 67_000,    coverArt: 'https://picsum.photos/seed/song-13/400/400' },
  { id: 's14', title: 'Glass City',         artistId: 'a7',  genre: 'Electronic',  mood: 'Late Night',  monthlyListeners: 67_000,    coverArt: 'https://picsum.photos/seed/song-14/400/400' },
  { id: 's15', title: 'Brass & Pepper',     artistId: 'a8',  genre: 'Jazz',        mood: 'Feel Good',   monthlyListeners: 45_000,    coverArt: 'https://picsum.photos/seed/song-15/400/400' },
  { id: 's16', title: 'Lagos Nights',       artistId: 'a8',  genre: 'Afrobeats',   mood: 'Hype',        monthlyListeners: 45_000,    coverArt: 'https://picsum.photos/seed/song-16/400/400' },
  { id: 's17', title: 'Cigarette Teeth',    artistId: 'a9',  genre: 'Emo',         mood: 'Melancholic', monthlyListeners: 5_800,     coverArt: 'https://picsum.photos/seed/song-17/400/400' },
  { id: 's18', title: 'Almost Home',        artistId: 'a9',  genre: 'Indie Folk',  mood: 'Sad Hours',   monthlyListeners: 5_800,     coverArt: 'https://picsum.photos/seed/song-18/400/400' },
  { id: 's19', title: 'Agua Dulce',         artistId: 'a10', genre: 'Bossa Nova',  mood: 'Chill',       monthlyListeners: 19_000,    coverArt: 'https://picsum.photos/seed/song-19/400/400' },
  { id: 's20', title: 'Rio de Sonhos',      artistId: 'a10', genre: 'R&B',         mood: 'Late Night',  monthlyListeners: 19_000,    coverArt: 'https://picsum.photos/seed/song-20/400/400' },
  { id: 's21', title: 'Cathedral Fog',      artistId: 'a11', genre: 'Dark Wave',   mood: 'Late Night',  monthlyListeners: 6_200_000, coverArt: 'https://picsum.photos/seed/song-21/400/400' },
  { id: 's22', title: 'Static & Glass',     artistId: 'a12', genre: 'Punk',        mood: 'Hype',        monthlyListeners: 4_500_000, coverArt: 'https://picsum.photos/seed/song-22/400/400' },
];

// ── Community posts ───────────────────────────────────────────────────────────
export const initialCommunityPosts = [
  { id: 'p1', songName: 'Tide & Timber',   artist: 'Sable & Shore',  coverArt: 'https://picsum.photos/seed/song-3/400/400',  submitter: 'wavechaser99',    reason: "Heard this in a tiny coffee shop in Portland. The guitar work is absolutely stunning and nobody is talking about it.", upvotes: 134, downvotes: 3,  userVote: null, commentCount: 18 },
  { id: 'p2', songName: 'Static Mind',     artist: 'Luna Vex',       coverArt: 'https://picsum.photos/seed/song-7/400/400',  submitter: 'darkwaveforever', reason: "This track has a beat drop that literally made me pull over my car. Pure underground gold.", upvotes: 289, downvotes: 11, userVote: null, commentCount: 42 },
  { id: 'p3', songName: 'Warm Honey',      artist: 'Mellow Earth',   coverArt: 'https://picsum.photos/seed/song-9/400/400',  submitter: 'soulfinder_j',    reason: "Reminds me of old Marvin Gaye but completely fresh. Their harmonies are criminally underrated.", upvotes: 412, downvotes: 7,  userVote: null, commentCount: 67 },
  { id: 'p4', songName: 'Cathedral Fog',   artist: 'Haze District',  coverArt: 'https://picsum.photos/seed/song-21/400/400', submitter: 'gothgirl_music',  reason: "Three listens and I can't stop. The synth texture in the second chorus is unlike anything I've heard this decade.", upvotes: 201, downvotes: 14, userVote: null, commentCount: 33 },
  { id: 'p5', songName: 'Cotton Clouds',   artist: 'Marigold Sloane',coverArt: 'https://picsum.photos/seed/song-11/400/400', submitter: 'dreampop_dan',    reason: "She recorded this at 3am and you can hear every sleepy breath in the mic. That's the whole point and it's perfect.", upvotes: 88,  downvotes: 5,  userVote: null, commentCount: 11 },
  { id: 'p6', songName: 'Lagos Nights',    artist: 'OZMA',           coverArt: 'https://picsum.photos/seed/song-16/400/400', submitter: 'rhythm_nerd',     reason: "The way the saxophone comes in at 1:47 — I genuinely gasped the first time. OZMA needs 10x the listeners.", upvotes: 167, downvotes: 8,  userVote: null, commentCount: 29 },
];

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
