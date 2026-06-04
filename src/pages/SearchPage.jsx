import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs, getArtistById, ALL_GENRES, ALL_MOODS, formatListeners } from '../data/mockData';
import { stopPreview } from '../utils/audio';
import RangeSlider, { sliderToCount } from '../components/RangeSlider';

const GENRE_LABELS = ALL_GENRES.map((g) => g.label);
const MOOD_LABELS  = ALL_MOODS.map((m) => m.label);
const TRENDING_SEARCHES = ['Dark Wave', 'Bossa Nova', 'Lo-Fi', 'Afrobeats', 'Dream Pop', 'Neo-Soul'];

export default function SearchPage() {
  const [query, setQuery]   = useState('');
  const [genre, setGenre]   = useState('All');
  const [mood,  setMood]    = useState('All');
  const [minV,  setMinV]    = useState(0);    // slider positions 0-100
  const [maxV,  setMaxV]    = useState(100);
  const navigate = useNavigate();

  const minListeners = sliderToCount(minV);
  const maxListeners = sliderToCount(maxV);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return songs.filter((s) => {
      const a = getArtistById(s.artistId);
      const matchQ = !q
        || s.title.toLowerCase().includes(q)
        || a?.name.toLowerCase().includes(q)
        || s.genre.toLowerCase().includes(q);
      return (
        matchQ
        && (genre === 'All' || s.genre === genre)
        && (mood  === 'All' || s.mood  === mood)
        && s.monthlyListeners >= minListeners
        && s.monthlyListeners <= maxListeners
      );
    });
  }, [query, genre, mood, minListeners, maxListeners]);

  const openArtist = (song) => {
    stopPreview();
    navigate('/artist', { state: { artist: getArtistById(song.artistId) } });
  };

  const isEmpty = !query && genre === 'All' && mood === 'All' && minV === 0 && maxV === 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div className="page-title">Search</div>
        <div className="page-subtitle">Filter by genre, mood, and listener count</div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Artist, song, genre…" value={query} onChange={(e) => setQuery(e.target.value)} />
        {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
      </div>

      {/* Genre filter */}
      <div>
        <p style={{ padding: '0 20px 7px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)' }}>Genre</p>
        <div className="chip-row">
          {['All', ...GENRE_LABELS].map((g) => (
            <button key={g} className={`filter-chip${genre === g ? ' active' : ''}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
      </div>

      {/* Mood filter */}
      <div>
        <p style={{ padding: '0 20px 7px', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)' }}>Mood</p>
        <div className="chip-row">
          {['All', ...MOOD_LABELS].map((m) => (
            <button key={m} className={`filter-chip${mood === m ? ' active' : ''}`} onClick={() => setMood(m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Listener range slider */}
      <RangeSlider minV={minV} maxV={maxV} onChange={(lo, hi) => { setMinV(lo); setMaxV(hi); }} />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isEmpty ? (
          /* Featured / empty state */
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
                  <button
                    key={g.id}
                    onClick={() => setGenre(g.label)}
                    style={{
                      background: 'var(--glass)', border: '1px solid var(--glass-border)',
                      borderRadius: 16, padding: '18px 16px', textAlign: 'left',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'all 0.2s',
                    }}
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
            {/* Results header */}
            <div className="results-header">
              <span className="results-count">{results.length} result{results.length !== 1 ? 's' : ''}</span>
              {(minV > 0 || maxV < 100) && (
                <button
                  onClick={() => { setMinV(0); setMaxV(100); }}
                  style={{ fontSize: 11, color: 'var(--purple-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Reset range
                </button>
              )}
            </div>

            <div style={{ padding: '0 20px 100px' }}>
              {results.length === 0 ? (
                <div className="empty-state">
                  <span className="gem-pulse empty-icon" style={{ fontSize: 40 }}>◆</span>
                  <div className="empty-title">No gems yet</div>
                  <div className="empty-sub">Songs are being added soon — check back shortly!</div>
                  <div className="coming-soon-badge" style={{ marginTop: 4 }}>Coming soon</div>
                </div>
              ) : (
                results.map((song) => {
                  const artist = getArtistById(song.artistId);
                  return (
                    <div key={song.id} className="glass glass-hover result-card" onClick={() => openArtist(song)}>
                      <img src={song.coverArt} alt={song.title} className="result-cover" />
                      <div className="result-info">
                        <div className="result-title">{song.title}</div>
                        <div className="result-artist">{artist?.name}</div>
                        <div className="result-chips">
                          <span className="chip chip-genre">{song.genre}</span>
                          <span className="chip chip-mood">{song.mood}</span>
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
