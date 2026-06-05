import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs as localSongs, getArtistById, ALL_GENRES, ALL_MOODS, formatListeners } from '../data/mockData';
import { stopPreview } from '../utils/audio';
import RangeSlider, { sliderToCount } from '../components/RangeSlider';
import { isConfigured, searchSpotifyTracks } from '../utils/spotify';

const GENRE_LABELS = ALL_GENRES.map((g) => g.label);
const MOOD_LABELS  = ALL_MOODS.map((m) => m.label);
const TRENDING_SEARCHES = ['Dark Wave', 'Bossa Nova', 'Lo-Fi', 'Afrobeats', 'Dream Pop', 'Neo-Soul'];

export default function SearchPage() {
  const [query,   setQuery]   = useState('');
  const [genre,   setGenre]   = useState('All');
  const [mood,    setMood]    = useState('All');
  const [minV,    setMinV]    = useState(0);
  const [maxV,    setMaxV]    = useState(100);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const navigate    = useNavigate();

  const minListeners = sliderToCount(minV);
  const maxListeners = sliderToCount(maxV);

  const isEmpty = !query && genre === 'All' && mood === 'All' && minV === 0 && maxV === 100;

  // Search logic: Spotify if configured, else local
  useEffect(() => {
    if (isEmpty) { setResults([]); return; }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        let found = [];
        if (isConfigured()) {
          found = await searchSpotifyTracks(query, minListeners, maxListeners, 40);
          // Client-side genre/mood filter
          if (genre !== 'All') found = found.filter((s) => s.genre === genre);
          if (mood  !== 'All') found = found.filter((s) => s.mood  === mood);
        } else {
          // Local filter
          const q = query.toLowerCase();
          found = localSongs.filter((s) => {
            const a = getArtistById(s.artistId);
            const matchQ = !q || s.title.toLowerCase().includes(q) || a?.name.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q);
            return matchQ
              && (genre === 'All' || s.genre === genre)
              && (mood  === 'All' || s.mood  === mood)
              && s.monthlyListeners >= minListeners
              && s.monthlyListeners <= maxListeners;
          });
        }
        setResults(found);
      } catch (e) {
        console.warn('Search failed:', e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(debounceRef.current);
  }, [query, genre, mood, minListeners, maxListeners]);

  const openArtist = (song) => {
    stopPreview();
    const artist = getArtistById(song.artistId) || {
      id: song.artistId, name: song.artistName, photo: song.coverArt,
      monthlyListeners: song.monthlyListeners, bio: '', genres: [song.genre],
      social: { spotify: song.artistSpotifyId ? `https://open.spotify.com/artist/${song.artistSpotifyId}` : '#' },
      spotifyId: song.artistSpotifyId,
    };
    navigate('/artist', { state: { artist } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div className="page-title">Search</div>
        <div className="page-subtitle">
          {isConfigured() ? 'Searching Spotify for underrated gems' : 'Filter by genre, mood, and listener count'}
        </div>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Artist, song, genre…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
      </div>

      <div>
        <p style={{ padding: '0 20px 7px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)' }}>Genre</p>
        <div className="chip-row">
          {['All', ...GENRE_LABELS].map((g) => (
            <button key={g} className={`filter-chip${genre === g ? ' active' : ''}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ padding: '0 20px 7px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)' }}>Mood</p>
        <div className="chip-row">
          {['All', ...MOOD_LABELS].map((m) => (
            <button key={m} className={`filter-chip${mood === m ? ' active' : ''}`} onClick={() => setMood(m)}>{m}</button>
          ))}
        </div>
      </div>

      <RangeSlider minV={minV} maxV={maxV} onChange={(lo, hi) => { setMinV(lo); setMaxV(hi); }} />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isEmpty ? (
          <div className="featured-section slide-up">
            <p className="section-label">🔥 Trending Searches</p>
            <div className="featured-chips">
              {TRENDING_SEARCHES.map((s) => (
                <button key={s} className="featured-chip" onClick={() => setQuery(s)}>{s}</button>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <p className="section-label">Browse by Genre</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {ALL_GENRES.slice(0, 8).map((g) => (
                  <button key={g.id} onClick={() => setGenre(g.label)}
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 16, padding: '18px 16px', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.background = 'var(--glass-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.background = 'var(--glass)'; }}
                  >
                    <span style={{ fontSize: 26 }}>{g.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="results-header">
              <span className="results-count">
                {loading ? 'Searching…' : `${results.length} result${results.length !== 1 ? 's' : ''}`}
              </span>
              {(minV > 0 || maxV < 100) && (
                <button onClick={() => { setMinV(0); setMaxV(100); }}
                  style={{ fontSize: 11, color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Reset range
                </button>
              )}
            </div>
            <div style={{ padding: '0 20px 100px' }}>
              {loading ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="shimmer" style={{ height: 82, borderRadius: 14, marginBottom: 8 }} />
                ))
              ) : results.length === 0 ? (
                <div className="empty-state">
                  <span className="gem-pulse empty-icon" style={{ fontSize: 40 }}>◆</span>
                  <div className="empty-title">No gems found</div>
                  <div className="empty-sub">{isConfigured() ? 'Try different keywords or widen the listener range' : 'Songs are being added soon — check back shortly!'}</div>
                  {!isConfigured() && <div className="coming-soon-badge" style={{ marginTop: 4 }}>Coming soon</div>}
                </div>
              ) : (
                results.map((song) => {
                  const artist = getArtistById(song.artistId);
                  const artistName = artist?.name || song.artistName || '';
                  return (
                    <div key={song.id} className="glass glass-hover result-card" onClick={() => openArtist(song)}>
                      <img src={song.coverArt} alt={song.title} className="result-cover" />
                      <div className="result-info">
                        <div className="result-title">{song.title}</div>
                        <div className="result-artist">{artistName}</div>
                        <div className="result-chips">
                          {song.genre && <span className="chip chip-genre">{song.genre}</span>}
                          {song.mood  && <span className="chip chip-mood">{song.mood}</span>}
                        </div>
                      </div>
                      <div className="result-right">
                        <div className="result-listeners">{formatListeners(song.monthlyListeners)}</div>
                        <div className="result-listeners-label">listeners</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
