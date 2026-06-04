import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs, getArtistById } from '../data/mockData';
import { stopPreview } from '../utils/audio';

const GENRES = ['All', 'Bedroom Pop', 'Folk', 'Ambient', 'Hip-Hop', 'Neo-Soul', 'Electronic', 'Dark Synth', 'Soul', 'R&B'];
const MOODS  = ['All', 'Chill', 'Dreamy', 'Melancholic', 'Hype', 'Sensual', 'Dark', 'Intense', 'Feel Good'];

function formatListeners(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [mood, setMood]   = useState('All');
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return songs.filter((s) => {
      const artist = getArtistById(s.artistId);
      const matchQ = !q || s.title.toLowerCase().includes(q) || artist?.name.toLowerCase().includes(q);
      return matchQ && (genre === 'All' || s.genre === genre) && (mood === 'All' || s.mood === mood) && s.monthlyListeners < 1_000_000;
    });
  }, [query, genre, mood]);

  const openArtist = (song) => {
    stopPreview();
    navigate('/artist', { state: { artist: getArtistById(song.artistId) } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div className="page-title">Search</div>
        <div className="page-subtitle">Find artists under 1M listeners</div>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          placeholder="Artist, song, genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && <button className="clear-btn" onClick={() => setQuery('')}>✕</button>}
      </div>

      {/* Genre chips */}
      <div style={{ paddingBottom: 4, paddingTop: 2 }}>
        <div style={{ padding: '0 20px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--gold)' }}>Genre</div>
        <div className="filter-row">
          {GENRES.map((g) => (
            <button key={g} className={`filter-chip${genre === g ? ' active-genre' : ''}`} onClick={() => setGenre(g)}>{g}</button>
          ))}
        </div>
      </div>

      {/* Mood chips */}
      <div style={{ paddingBottom: 4 }}>
        <div style={{ padding: '0 20px 6px', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--gold)' }}>Mood</div>
        <div className="filter-row">
          {MOODS.map((m) => (
            <button key={m} className={`filter-chip${mood === m ? ' active-mood' : ''}`} onClick={() => setMood(m)}>{m}</button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="results-header">
        <span className="results-count">{results.length} result{results.length !== 1 ? 's' : ''}</span>
        <span className="results-note">All under 1M listeners</span>
      </div>

      {/* Results list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
        {results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◆</div>
            <div className="empty-title">No gems found</div>
            <div className="empty-sub">Try adjusting your filters</div>
          </div>
        ) : (
          results.map((song) => {
            const artist = getArtistById(song.artistId);
            return (
              <div key={song.id} className="card result-card" onClick={() => openArtist(song)}>
                <img src={song.coverArt} alt={song.title} className="result-thumb" />
                <div className="result-info">
                  <div className="result-title">{song.title}</div>
                  <div className="result-artist">{artist?.name}</div>
                  <div className="result-chips">
                    <span className="chip chip-genre">{song.genre}</span>
                    <span className="chip chip-mood">{song.mood}</span>
                  </div>
                </div>
                <div className="result-listeners">
                  <div className="listener-num">{formatListeners(song.monthlyListeners)}</div>
                  <div className="listener-label">listeners</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
