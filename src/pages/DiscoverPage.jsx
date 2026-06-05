import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs as localSongs, getArtistById, formatListeners } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { stopPreview } from '../utils/audio';
import ShareModal from '../components/ShareModal';
import SoundCloudPlayer from '../components/SoundCloudPlayer';

const SWIPE_THRESHOLD = 80;
const DAILY_GOAL      = 10;

// ── Empty / loading states ────────────────────────────────────────────────────
function EmptyState({ streak, discoverProgress, loading }) {
  const prog = Math.min((discoverProgress.seen / DAILY_GOAL) * 100, 100);
  return (
    <div className="discover-root">
      <div className="logo-header">
        <div className="logo-mark">
          <span className="logo-gem">◆</span>
          <span className="gradient-text" style={{ fontWeight: 900, fontSize: 22 }}>FindTheGems</span>
        </div>
        <div className="logo-sub">Discover music before it blows up</div>
      </div>
      <div className="discover-meta">
        <span className="discover-progress-text">0 of {DAILY_GOAL} today</span>
        <div className="discover-progress-bar"><div className="discover-progress-fill" style={{ width: `${prog}%` }} /></div>
        <div className="streak-badge">🔥 {streak.count}</div>
      </div>
      <div className="deck-area">
        {[{ scale: 0.90, z: 0, ty: -28 }, { scale: 0.95, z: 1, ty: -14 }, { scale: 1, z: 2, ty: 0 }].map(({ scale, z, ty }, i) => (
          <div key={i} className="song-card ghost-card"
            style={{ transform: `scale(${scale}) translateY(${ty}px)`, zIndex: z, aspectRatio: '3/4.2', pointerEvents: 'none' }} />
        ))}
        <div style={{ position: 'absolute', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 32px', gap: 10 }}>
          {loading ? (
            <>
              <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.3)', borderTop: '3px solid var(--purple)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Finding gems…</p>
            </>
          ) : (
            <>
              <span className="gem-pulse" style={{ fontSize: 52 }}>◆</span>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.3px' }}>No gems yet</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: 240 }}>
                {isConfigured()
                  ? 'No tracks matched — try again or adjust your genre preferences.'
                  : 'Songs are being added soon — check back shortly!'}
              </p>
              <div className="coming-soon-badge" style={{ marginTop: 6 }}>◆ Coming soon</div>
            </>
          )}
        </div>
      </div>
      <div className="deck-actions">
        <button className="action-btn action-skip" disabled style={{ opacity: 0.22, cursor: 'default' }}>✕</button>
        <button className="action-btn action-save" disabled style={{ opacity: 0.22, cursor: 'default' }}>♥</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DiscoverPage() {
  const [deck,      setDeck]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [offset,    setOffset]    = useState({ x: 0, y: 0 });
  const [dragging,  setDragging]  = useState(false);
  const [animating, setAnimating] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [savePop,   setSavePop]   = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [scOpen,    setScOpen]    = useState(false);
  const startRef  = useRef({ x: 0, y: 0 });
  const navigate  = useNavigate();
  const { saveSong, discoverProgress, incrementDiscover, streak, profile } = useApp();

  const topSong   = deck[0];
  const topArtist = topSong ? getArtistById(topSong.artistId) : null;

  // Load initial deck — always use the curated local song list
  useEffect(() => {
    setDeck([...localSongs]);
    setLoading(false);
  }, []);

  useEffect(() => () => stopPreview(), []);

  // All hooks must be declared before any early return (Rules of Hooks)
  const showToast = (type) => { setToast(type); setTimeout(() => setToast(null), 900); };

  const advanceDeck = useCallback(() => {
    setDeck((prev) => prev.length > 1 ? prev.slice(1) : [...localSongs]);
    incrementDiscover();
  }, [incrementDiscover]);

  const doSwipe = useCallback((dir) => {
    if (animating || !topSong) return;
    setAnimating(true);
    setScOpen(false); // close SoundCloud player on swipe
    if (dir === 'right') { saveSong(topSong); setSavePop(true); setTimeout(() => setSavePop(false), 350); }
    showToast(dir === 'right' ? 'save' : 'skip');
    setOffset({ x: dir === 'right' ? 650 : -650, y: 0 });
    setTimeout(() => { setOffset({ x: 0, y: 0 }); advanceDeck(); setAnimating(false); }, 360);
  }, [animating, topSong, saveSong, advanceDeck]);

  if (loading || deck.length === 0) {
    return <EmptyState streak={streak} discoverProgress={discoverProgress} loading={loading} />;
  }

  const onPointerDown = (e) => {
    if (animating) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - startRef.current.x, y: (e.clientY - startRef.current.y) * 0.2 });
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if      (offset.x >  SWIPE_THRESHOLD) doSwipe('right');
    else if (offset.x < -SWIPE_THRESHOLD) doSwipe('left');
    else setOffset({ x: 0, y: 0 });
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!topSong) return;
    setScOpen((prev) => !prev); // toggle the SoundCloud player
  };

  const goToArtist = (e) => {
    e.stopPropagation();
    const artist = topArtist || { id: topSong.artistId, name: topSong.artistName, spotifyId: topSong.artistSpotifyId };
    if (artist) { stopPreview(); setPlayingId(null); navigate('/artist', { state: { artist } }); }
  };

  const rot    = dragging ? (offset.x / 22).toFixed(2) : 0;
  const saveOp = Math.max(0, Math.min(offset.x / 90, 1));
  const skipOp = Math.max(0, Math.min(-offset.x / 90, 1));
  const seen   = discoverProgress.seen;
  const prog   = Math.min((seen / DAILY_GOAL) * 100, 100);

  return (
    <div className="discover-root">
      <div className="logo-header">
        <div className="logo-mark">
          <span className="logo-gem">◆</span>
          <span className="gradient-text" style={{ fontWeight: 900, fontSize: 22 }}>FindTheGems</span>
        </div>
        <div className="logo-sub">Discover music before it blows up</div>
      </div>

      <div className="discover-meta">
        <span className="discover-progress-text">{Math.min(seen, DAILY_GOAL)} of {DAILY_GOAL} today</span>
        <div className="discover-progress-bar"><div className="discover-progress-fill" style={{ width: `${prog}%` }} /></div>
        <div className="streak-badge">🔥 {streak.count}</div>
      </div>

      <div className="deck-area">
        {toast && <div className={`discover-toast toast-${toast}`}>{toast === 'save' ? '♥ Saved!' : '✕ Skipped'}</div>}

        {deck.slice(1, 3).reverse().map((song, i) => (
          <div key={song.id} className="song-card" style={{ transform: `scale(${0.93 - i * 0.025}) translateY(${(1 - i) * -14}px)`, zIndex: i, pointerEvents: 'none', aspectRatio: '3/4.2' }}>
            <div className="song-card-img" style={{ backgroundImage: `url(${song.coverArt})` }} />
            <div className="song-card-overlay" />
          </div>
        ))}

        {topSong && (
          <div
            key={topSong.id}
            className="song-card"
            style={{ transform: `translate(${offset.x}px,${offset.y}px) rotate(${rot}deg)`, transition: dragging ? 'none' : 'transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94)', zIndex: 5, aspectRatio: '3/4.2' }}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
          >
            <div className="song-card-img" style={{ backgroundImage: `url(${topSong.coverArt})` }} />
            <div className="song-card-overlay" />

            {topArtist && <img src={topArtist.photo} alt={topArtist.name} className="song-card-artist-photo" />}

            {/* Share button */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setShareOpen(true); }}
              style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '5px 11px', cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', zIndex: 6 }}
            >
              ↗ Share
            </button>

            <div className="swipe-stamp stamp-save" style={{ opacity: saveOp }}>SAVE</div>
            <div className="swipe-stamp stamp-skip" style={{ opacity: skipOp }}>SKIP</div>

            <div className="song-card-body">
              <div className="song-card-chips">
                <span className="chip chip-genre">{topSong.genre}</span>
                {topSong.mood && <span className="chip chip-mood">{topSong.mood}</span>}
              </div>
              <div className="song-card-title">{topSong.title}</div>
              <div className="song-card-artist" onPointerDown={(e) => e.stopPropagation()} onClick={goToArtist}>
                {topArtist?.name || topSong.artistName}
              </div>
              <div className="song-card-listeners">
                <span className="listeners-dot" />
                {formatListeners(topSong.monthlyListeners)} monthly listeners
              </div>
              <button className="song-card-play" onPointerDown={(e) => e.stopPropagation()} onClick={handlePlay}>
                {scOpen ? '✕ Close Player' : '▶ Play Preview'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="deck-actions">
        <button className="action-btn action-skip" onClick={() => doSwipe('left')} aria-label="Skip">✕</button>
        <button className={`action-btn action-save${savePop ? ' saved' : ''}`} onClick={() => doSwipe('right')} aria-label="Save">♥</button>
      </div>

      {scOpen && topSong && (
        <SoundCloudPlayer
          scEmbedUrl={topSong.scEmbedUrl || null}
          soundcloudUrl={topSong.soundcloudUrl || null}
          spotifyFallback={topSong.spotifyFallback || (topSong.artistSpotifyId ? `https://open.spotify.com/artist/${topSong.artistSpotifyId}` : null)}
          artistName={topArtist?.name || topSong.artistName || ''}
          songTitle={topSong.title}
          onClose={() => setScOpen(false)}
        />
      )}

      {shareOpen && topSong && (
        <ShareModal song={topSong} artistOverride={topArtist} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
}
