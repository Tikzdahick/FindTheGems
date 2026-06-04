import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSongsByArtist } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { playPreview, stopPreview } from '../utils/audio';

const SOCIAL_CONFIG = {
  spotify:    { icon: '🎵', label: 'Spotify' },
  appleMusic: { icon: '🍎', label: 'Apple Music' },
  soundcloud: { icon: '☁️', label: 'SoundCloud' },
  instagram:  { icon: '📸', label: 'Instagram' },
  tiktok:     { icon: '🎶', label: 'TikTok' },
};

function formatListeners(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export default function ArtistProfilePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const artist = state?.artist;
  const [playingId, setPlayingId] = useState(null);
  const { isFollowing, toggleFollow } = useApp();

  const songs = artist ? getSongsByArtist(artist.id) : [];
  const following = artist ? isFollowing(artist.id) : false;

  useEffect(() => () => stopPreview(), []);

  if (!artist) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◆</div>
        <div className="empty-title">Artist not found</div>
        <button className="btn btn-purple" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const handlePlay = (song) => {
    if (playingId === song.id) {
      stopPreview();
      setPlayingId(null);
      return;
    }
    const started = playPreview(song.previewUrl, song.id, () => setPlayingId(null));
    if (started) setPlayingId(song.id);
  };

  const handleBack = () => {
    stopPreview();
    setPlayingId(null);
    navigate(-1);
  };

  return (
    <div style={{ minHeight: '100%', paddingBottom: 40 }}>
      {/* Hero */}
      <div className="artist-hero">
        <div className="artist-hero-img" style={{ backgroundImage: `url(${artist.photo})` }} />
        <div className="artist-hero-overlay" />
        <button className="back-btn" onClick={handleBack}>← Back</button>
        <div className="artist-hero-content">
          <div className="artist-name">{artist.name}</div>
          <div className="artist-listeners">
            <span className="listeners-dot" style={{ color: 'var(--gold)', fontSize: 8 }}>◆</span>
            {formatListeners(artist.monthlyListeners)} monthly listeners
          </div>
          <div className="artist-genres">
            {artist.genres.map((g) => (
              <span key={g} className="chip chip-genre">{g}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Follow */}
      <div style={{ padding: '16px 20px' }}>
        <button
          className={`btn btn-outline${following ? ' active' : ''}`}
          style={{ width: '100%' }}
          onClick={() => toggleFollow(artist.id)}
        >
          {following ? '✓ Following' : '+ Follow Artist'}
        </button>
      </div>

      <div className="artist-body">
        {/* Bio */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-title">About</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.65 }}>{artist.bio}</p>
        </div>

        {/* Songs */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-title">Top Songs</div>
          {songs.map((song) => (
            <div key={song.id} className="song-row" onClick={() => handlePlay(song)}>
              <img src={song.coverArt} alt={song.title} className="song-thumb" />
              <div className="song-row-info">
                <div className="song-row-title">{song.title}</div>
                <div className="song-row-genre">{song.genre}</div>
              </div>
              <button className="play-circle" tabIndex={-1}>
                {playingId === song.id ? '⏹' : '▶'}
              </button>
            </div>
          ))}
        </div>

        {/* Social */}
        <div>
          <div className="section-title">Find on Platforms</div>
          <div className="social-grid">
            {Object.entries(artist.social).map(([key, url]) => {
              const cfg = SOCIAL_CONFIG[key];
              if (!cfg) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="social-btn">
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
