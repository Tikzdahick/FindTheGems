import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getArtistById } from '../data/mockData';
import { stopPreview } from '../utils/audio';

export default function SavedPage() {
  const { savedSongs, removeSong } = useApp();
  const navigate = useNavigate();

  const open = (song) => {
    stopPreview();
    navigate('/artist', { state: { artist: getArtistById(song.artistId) } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header">
        <div className="page-title">Your <span className="gradient-text">Gems</span></div>
        <div className="page-subtitle">{savedSongs.length} saved song{savedSongs.length !== 1 ? 's' : ''}</div>
      </div>

      {savedSongs.length === 0 ? (
        <div className="empty-state" style={{ flex: 1 }}>
          <div className="empty-icon">◆</div>
          <div className="empty-title">No gems yet</div>
          <div className="empty-sub">Swipe right or tap ♥ in Discover to save songs here</div>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="saved-grid">
            {savedSongs.map((song) => {
              const artist = getArtistById(song.artistId);
              return (
                <div key={song.id} className="saved-item" onClick={() => open(song)}>
                  <div className="saved-cover" style={{ backgroundImage: `url(${song.coverArt})` }} />
                  <div className="saved-overlay" />
                  <div className="saved-content">
                    <span className="saved-genre-tag">{song.genre}</span>
                    <div className="saved-title">{song.title}</div>
                    <div className="saved-artist">{artist?.name}</div>
                  </div>
                  <button className="saved-remove" onClick={(e) => { e.stopPropagation(); removeSong(song.id); }} aria-label="Remove">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
