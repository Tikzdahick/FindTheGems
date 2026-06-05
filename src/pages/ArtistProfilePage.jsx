import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSongsByArtist, formatListeners } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { stopPreview } from '../utils/audio';
import { isConfigured, fetchArtistPhoto } from '../utils/spotify';
import ShareModal from '../components/ShareModal';
import SoundCloudPlayer from '../components/SoundCloudPlayer';

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
  const navArtist   = state?.artist;

  const [artist, setArtist] = useState(navArtist || null);
  const [songs,  setSongs]  = useState(navArtist ? getSongsByArtist(navArtist.id) : []);
  const [loading, setLoading] = useState(false);
  const [scSong,    setScSong]    = useState(null); // song whose SC player is open
  const [shareItem, setShareItem] = useState(null);
  const { isFollowing, toggleFollow } = useApp();

  // Fetch the high-res Spotify artist photo (640px).
  // The Client Credentials API returns images but not followers/genres/popularity,
  // so we only take the photo and keep bio/genres/listeners from mockData.
  useEffect(() => {
    const spotifyId = navArtist?.spotifyId || (navArtist?.id?.startsWith('sp_') ? navArtist.id.slice(3) : null);
    if (!spotifyId || !isConfigured()) return;
    let active = true;

    fetchArtistPhoto(spotifyId)
      .then(photo => {
        if (photo && active) {
          setArtist(prev => prev ? { ...prev, photo } : prev);
        }
      })
      .catch(() => {});

    return () => { active = false; };
  }, [navArtist?.id]);

  useEffect(() => () => stopPreview(), []);

  if (!artist) return (
    <div className="empty-state" style={{ height: '100%' }}>
      <div className="empty-icon">◆</div>
      <div className="empty-title">Artist not found</div>
      <button className="btn btn-purple" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>Go back</button>
    </div>
  );

  const following = isFollowing(artist.id);

  const handlePlay = (song) => setScSong((prev) => prev?.id === song.id ? null : song);

  const back = () => { navigate(-1); };

  return (
    <div style={{ minHeight: '100%', paddingBottom: 40 }} className="fade-in">
      {/* Hero */}
      <div className="artist-hero">
        {loading && <div className="shimmer" style={{ position: 'absolute', inset: 0 }} />}
        <div className="artist-hero-bg" style={{ backgroundImage: `url(${artist.photo})` }} />
        <div className="artist-hero-overlay" />
        <button className="back-btn" onClick={back}>← Back</button>

        {/* Share button */}
        <button
          onClick={() => setShareItem({ type: 'artist', artist })}
          style={{ position: 'absolute', top: 18, right: 16, background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '6px 13px', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', zIndex: 5 }}
        >
          ↗ Share
        </button>

        <div className="artist-hero-info">
          <div className="artist-name">{artist.name}</div>
          <div className="artist-listeners">
            <span className="listeners-dot" />
            {formatListeners(artist.monthlyListeners)} monthly listeners
            {artist.followers > 0 && ` · ${artist.followers.toLocaleString()} Spotify followers`}
          </div>
          <div className="artist-genres">
            {(artist.genres || []).map((g) => <span key={g} className="chip chip-genre">{g}</span>)}
          </div>
        </div>
      </div>

      {/* Follow */}
      <div style={{ padding: '16px 20px' }}>
        <button className={`btn btn-outline${following ? ' active' : ''}`} style={{ width: '100%' }} onClick={() => toggleFollow(artist.id)}>
          {following ? '✓ Following' : '+ Follow Artist'}
        </button>
      </div>

      <div className="artist-body">
        {/* Bio */}
        <div style={{ marginBottom: 28 }}>
          <p className="section-label">About</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7, fontWeight: 400 }}>{artist.bio}</p>
        </div>

        {/* Top songs */}
        {songs.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p className="section-label">Top Songs</p>
            {songs.map((song) => (
              <div key={song.id} style={{ position: 'relative' }}>
                <div className="song-row" onClick={() => handlePlay(song)}>
                  <img src={song.coverArt} alt={song.title} className="song-row-thumb" />
                  <div className="song-row-info">
                    <div className="song-row-title">{song.title}</div>
                    <div className="song-row-genre">{[song.genre, song.mood].filter(Boolean).join(' · ')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="btn-ghost"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-dim)', padding: '4px 6px', borderRadius: 8 }}
                      onClick={(e) => { e.stopPropagation(); setShareItem({ type: 'song', song, artist }); }}
                    >
                      ↗
                    </button>
                    <button className="play-circle" tabIndex={-1}>{scSong?.id === song.id ? '■' : '▶'}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social links */}
        <div>
          <p className="section-label">Find on Platforms</p>
          <div className="social-grid">
            {Object.entries(artist.social || {}).map(([key, url]) => {
              const cfg = SOCIAL[key];
              if (!cfg || !url || url === '#') return key === 'spotify' ? (
                <a key={key} href={`https://open.spotify.com/search/${encodeURIComponent(artist.name)}`} target="_blank" rel="noreferrer" className="social-link">
                  <span>🎵</span><span>Spotify</span>
                </a>
              ) : null;
              return (
                <a key={key} href={url} target="_blank" rel="noreferrer" className="social-link">
                  <span>{cfg.icon}</span><span>{cfg.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* SoundCloud player — per song */}
      {scSong && (
        <SoundCloudPlayer
          soundcloudUrl={scSong.soundcloudUrl || artist?.social?.soundcloud || ''}
          artistName={artist?.name || ''}
          songTitle={scSong.title}
          onClose={() => setScSong(null)}
        />
      )}

      {/* Share modals */}
      {shareItem?.type === 'song' && (
        <ShareModal song={shareItem.song} artistOverride={shareItem.artist} onClose={() => setShareItem(null)} />
      )}
      {shareItem?.type === 'artist' && songs[0] && (
        <ShareModal song={songs[0]} artistOverride={artist} onClose={() => setShareItem(null)} />
      )}
    </div>
  );
}
