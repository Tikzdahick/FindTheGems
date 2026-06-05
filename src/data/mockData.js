// ── Genres & Moods ────────────────────────────────────────────────────────────
export const ALL_GENRES = [
  { id: 'rap',          label: 'Rap',          emoji: '🎤' },
  { id: 'hip-hop',      label: 'Hip-Hop',      emoji: '🎧' },
  { id: 'bedroom-pop',  label: 'Bedroom Pop',  emoji: '🛏️' },
  { id: 'lo-fi',        label: 'Lo-Fi',        emoji: '📻' },
  { id: 'indie-folk',   label: 'Indie Folk',   emoji: '🌿' },
  { id: 'neo-soul',     label: 'Neo-Soul',     emoji: '✨' },
  { id: 'dark-wave',    label: 'Dark Wave',    emoji: '🌊' },
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
// Schema: { id, name, photo, monthlyListeners, bio, genres: string[],
//           social: { spotify, appleMusic, soundcloud, instagram, tiktok },
//           spotifyId }
export const artists = [
  {
    id:               'sp_6dCvTKdEJbcoV2IAL0H0W0',
    name:             'QUANTRELL',
    photo:            'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    monthlyListeners: 560000,
    bio:              'QUANTRELL is an underrated rap artist with a raw and authentic sound. Every track is built from real experience — no filter, no filler.',
    genres:           ['Rap'],
    social: {
      spotify:    'https://open.spotify.com/artist/6dCvTKdEJbcoV2IAL0H0W0',
      appleMusic: 'https://music.apple.com/us/artist/quantrell/1821980755',
      soundcloud: 'https://soundcloud.com/sincerelyquetee',
      instagram:  '#',
      tiktok:     '#',
    },
    spotifyId: '6dCvTKdEJbcoV2IAL0H0W0',
  },
  {
    id:               'sp_1yqmgJoPnWJO0pxbZvxvCX',
    name:             '1up Tee',
    photo:            'https://i.scdn.co/image/ab67616d00001e02a852cf3ece1f626b4d727016',
    monthlyListeners: 530000,
    bio:              '1up Tee is a rising rap artist bringing a fresh perspective to the game — sharp lyrics, harder beats, and a level-up mentality in every bar.',
    genres:           ['Rap'],
    social: {
      spotify:    'https://open.spotify.com/artist/1yqmgJoPnWJO0pxbZvxvCX',
      appleMusic: 'https://music.apple.com/us/artist/1uptee/1601694366',
      soundcloud: 'https://soundcloud.com/day1-tee',
      instagram:  '#',
      tiktok:     '#',
    },
    spotifyId: '1yqmgJoPnWJO0pxbZvxvCX',
  },
  {
    id:               'sp_2304Hcgi7OV6YL5Omhx6A4',
    name:             'BashfortheWorld',
    photo:            'https://i.scdn.co/image/ab67616d0000b273be2929e045652fd263783202',
    monthlyListeners: 2500000,
    bio:              'BashfortheWorld is making waves with high-energy tracks and undeniable momentum. Already pushing past 2.5M listeners — still only getting started.',
    genres:           ['Rap'],
    social: {
      spotify:    'https://open.spotify.com/artist/2304Hcgi7OV6YL5Omhx6A4',
      appleMusic: 'https://music.apple.com/us/artist/bashfortheworld/1522928860',
      soundcloud: 'https://soundcloud.com/search?q=bashfortheworld',
      instagram:  '#',
      tiktok:     '#',
    },
    spotifyId: '2304Hcgi7OV6YL5Omhx6A4',
  },
  {
    id:               'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    name:             'Lackvill',
    photo:            'https://i.scdn.co/image/ab67616d0000b273a53772e3bee74081ab05fdf1',
    monthlyListeners: 625000,
    bio:              'Lackvill is a versatile rap artist with a catalog full of hidden gems. From street anthems to melodic cuts, the range is real and the bars never slip.',
    genres:           ['Rap'],
    social: {
      spotify:    'https://open.spotify.com/artist/4iFCJ4DmsDgP3vpNC1zcSx',
      appleMusic: 'https://music.apple.com/us/artist/lackvill/1473029829',
      soundcloud: 'https://soundcloud.com/lackvill',
      instagram:  '#',
      tiktok:     '#',
    },
    spotifyId: '4iFCJ4DmsDgP3vpNC1zcSx',
  },
];

// ── Songs ─────────────────────────────────────────────────────────────────────
// previewUrl: real archive.org MP3s (CORS-enabled, no auth needed).
// These are openly licensed hip-hop instrumentals used as audio placeholders
// until the actual artist tracks become available for streaming.
export const songs = [
  // ── QUANTRELL ──────────────────────────────────────────────────────────────
  {
    id:               's1',
    title:            'YES MAAM',
    artistId:         'sp_6dCvTKdEJbcoV2IAL0H0W0',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 560000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz/DJ_Farwest_-_50_Yards.mp3',
    artistSpotifyId:  '6dCvTKdEJbcoV2IAL0H0W0',
    artistName:       'QUANTRELL',
  },
  {
    id:               's2',
    title:            "IT'S THE CASH FAULT",
    artistId:         'sp_6dCvTKdEJbcoV2IAL0H0W0',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 560000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz/DJ_Farwest_-_Arabic.mp3',
    artistSpotifyId:  '6dCvTKdEJbcoV2IAL0H0W0',
    artistName:       'QUANTRELL',
  },
  {
    id:               's3',
    title:            'CASH FLOW',
    artistId:         'sp_6dCvTKdEJbcoV2IAL0H0W0',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 560000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz/DJ_Farwest_-_Autumn.mp3',
    artistSpotifyId:  '6dCvTKdEJbcoV2IAL0H0W0',
    artistName:       'QUANTRELL',
  },
  {
    id:               's4',
    title:            'UNDERRATED',
    artistId:         'sp_6dCvTKdEJbcoV2IAL0H0W0',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 560000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz/DJ_Farwest_-_BackBeat.mp3',
    artistSpotifyId:  '6dCvTKdEJbcoV2IAL0H0W0',
    artistName:       'QUANTRELL',
  },
  {
    id:               's5',
    title:            "Punchin' Da Clock",
    artistId:         'sp_6dCvTKdEJbcoV2IAL0H0W0',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 560000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Headz_Of_Tomorrow/1000_Sassa_-_Schwiz_het_keis_Gheddo.mp3',
    artistSpotifyId:  '6dCvTKdEJbcoV2IAL0H0W0',
    artistName:       'QUANTRELL',
  },
  {
    id:               's6',
    title:            'MARSHAWN LYNCH',
    artistId:         'sp_6dCvTKdEJbcoV2IAL0H0W0',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 560000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b2732a49687d302af1769ce571ae',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Headz_Of_Tomorrow/2Hoch4_-_Geht_Da_Was.mp3',
    artistSpotifyId:  '6dCvTKdEJbcoV2IAL0H0W0',
    artistName:       'QUANTRELL',
  },
  // ── 1up Tee ────────────────────────────────────────────────────────────────
  {
    id:               's7',
    title:            'Literally Doe',
    artistId:         'sp_1yqmgJoPnWJO0pxbZvxvCX',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 530000,
    coverArt:         'https://i.scdn.co/image/ab67616d00001e02a852cf3ece1f626b4d727016',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Headz_Of_Tomorrow/3rd-music_-_3te-mucke.mp3',
    artistSpotifyId:  '1yqmgJoPnWJO0pxbZvxvCX',
    artistName:       '1up Tee',
  },
  // ── BashfortheWorld ────────────────────────────────────────────────────────
  {
    id:               's8',
    title:            'MVP',
    artistId:         'sp_2304Hcgi7OV6YL5Omhx6A4',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 2500000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b273be2929e045652fd263783202',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Headz_Of_Tomorrow/Abenick_-_Wow.mp3',
    artistSpotifyId:  '2304Hcgi7OV6YL5Omhx6A4',
    artistName:       'BashfortheWorld',
  },
  {
    id:               's9',
    title:            'On the Map',
    artistId:         'sp_2304Hcgi7OV6YL5Omhx6A4',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 2500000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b273be2929e045652fd263783202',
    previewUrl:       'https://archive.org/download/K-MasterStrikeBeatz-UnitedStateOfAlbania_201902/01.%20Bizele.mp3',
    artistSpotifyId:  '2304Hcgi7OV6YL5Omhx6A4',
    artistName:       'BashfortheWorld',
  },
  // ── Lackvill ───────────────────────────────────────────────────────────────
  {
    id:               's10',
    title:            'Flexing All Summer',
    artistId:         'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 625000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b273a53772e3bee74081ab05fdf1',
    previewUrl:       'https://archive.org/download/K-MasterStrikeBeatz-UnitedStateOfAlbania_201902/02.%20Boulevard.mp3',
    artistSpotifyId:  '4iFCJ4DmsDgP3vpNC1zcSx',
    artistName:       'Lackvill',
  },
  {
    id:               's11',
    title:            'Long Time Coming',
    artistId:         'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 625000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b273bba3b5cb6d4be2ec9b54c26f',
    previewUrl:       'https://archive.org/download/K-MasterStrikeBeatz-UnitedStateOfAlbania_201902/03.%20Dope%20Man%20%28Feat.%20Lluni%29.mp3',
    artistSpotifyId:  '4iFCJ4DmsDgP3vpNC1zcSx',
    artistName:       'Lackvill',
  },
  {
    id:               's12',
    title:            'NO JUMPER',
    artistId:         'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 625000,
    coverArt:         'https://i1.sndcdn.com/artworks-wngUgukgnnnz-0-t500x500.jpg',
    previewUrl:       'https://archive.org/download/K-MasterStrikeBeatz-UnitedStateOfAlbania_201902/04.%20Semafori.mp3',
    artistSpotifyId:  '4iFCJ4DmsDgP3vpNC1zcSx',
    artistName:       'Lackvill',
  },
  {
    id:               's13',
    title:            'Batman & Robin',
    artistId:         'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 625000,
    coverArt:         'https://i.scdn.co/image/ab67616d0000b27347b21dd6b244ddbfcf601634',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz01/DJ_Farwest_-_0_Access.mp3',
    artistSpotifyId:  '4iFCJ4DmsDgP3vpNC1zcSx',
    artistName:       'Lackvill',
  },
  {
    id:               's14',
    title:            'NOT YOUR FLOW',
    artistId:         'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 625000,
    coverArt:         'https://i1.sndcdn.com/artworks-PS3h7X0Pamnp-0-t500x500.jpg',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz01/DJ_Farwest_-_10_Cent.mp3',
    artistSpotifyId:  '4iFCJ4DmsDgP3vpNC1zcSx',
    artistName:       'Lackvill',
  },
  {
    id:               's15',
    title:            'Way 2 Grown',
    artistId:         'sp_4iFCJ4DmsDgP3vpNC1zcSx',
    genre:            'Rap',
    mood:             'Hype',
    monthlyListeners: 625000,
    coverArt:         'https://i1.sndcdn.com/artworks-hPqUvUNMFjp3-0-t500x500.jpg',
    previewUrl:       'https://archive.org/download/Hiphop-Farwest_-_Beatz01/DJ_Farwest_-_6_Finger_Joe.mp3',
    artistSpotifyId:  '4iFCJ4DmsDgP3vpNC1zcSx',
    artistName:       'Lackvill',
  },
];

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
