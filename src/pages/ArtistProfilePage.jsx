import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSongsByArtist, formatListeners } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { playPreview, stopPreview } from '../utils/audio';

const SOCIAL = {
  spotify:    { icon: '🎵', label: 'Spotify' },
  appleMusic: { icon: '🍎', label: 'Apple Music' },
  soundcloud: { icon: '☁️', label: 'SoundCloud' },
  instagram:  { icon: '📸', label: 'Instagram' },
  tiktok:     { icon: '🎶', label: 'TikTok' },
};

export default function ArtistProfilePage() {
  const navigate    = useNavigate();
  const { state }   = useLocation();
  const artist      = state?.artist;
  const [playing, setPlaying] = useState(null);
  const { isFollowing, toggleFollow } = useApp();
  const songs    = artist ? getSongsByArtist(artist.id) : [];
  const following = artist ? isFollowing(artist.id) : false;

  useEffect(() => () => stopPreview(), []);

  if (!artist) return (
    <div className="empty-state" style={{ height: '100%' }}>
      <div className="empty-icon">◆</div>
      <div className="empty-title">Artist not found</div>
      <button className="btn btn-purple" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>Go back</button>
    </div>
  );

  const handlePlay = (song) => {
    const ok = playPreview(song.id, song.mood, () => setPlaying(null));
    setPlaying(ok ? song.id : null);
  };
  const back = () => { stopPreview(); setPlaying(null); navigate(-1); };

  return (
    <div style={{ minHeight: '100%', paddingBottom: 40 }} className="fade-in">
      {/* Hero */}
      <div className="artist-hero">
        <div className="artist-hero-bg" style={{ backgroundImage: `url(${artist.photo})` }} />
        <div className="artist-hero-overlay" />
        <button className="back-btn" onClick={back}>← Back</button>
        <div className="artist-hero-info">
          <div className="artist-name">{artist.name}</div>
          <div className="artist-listeners">
            <span className="listeners-dot" />
            {formatListeners(artist.monthlyListeners)} monthly listeners
          </div>
          <div className="artist-genres">
            {artist.genres.map((g) => <span key={g} className="chip chip-genre">{g}</span>)}
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
          <p className="section-label">About</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 400 }}>{artist.bio}</p>
        </div>

        {/* Songs */}
        <div style={{ marginBottom: 28 }}>
          <p className="section-label">Top Songs</p>
          {songs.map((song) => (
            <div key={song.id} className="song-row" onClick={() => handlePlay(song)}>
              <img src={song.coverArt} alt={song.title} className="song-row-thumb" />
              <div className="song-row-info">
                <div className="song-row-title">{song.title}</div>
                <div className="song-row-genre">{song.genre} · {song.mood}</div>
              </div>
              <button className="play-circle" tabIndex={-1}>{playing === song.id ? '⏹' : '▶'}</button>
            </div>
          ))}
        </div>

        {/* Social */}
        <div>
          <p className="section-label">Find on Platforms</p>
          <div className="social-grid">
            {Object.entries(artist.social).map(([key, url]) => {
              const cfg = SOCIAL[key];
              if (!cfg) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="social-link">
                  <span>{cfg.icon}</span><span>{cfg.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
