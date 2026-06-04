import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs, getArtistById, formatListeners } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { playPreview, stopPreview } from '../utils/audio';

const SWIPE_THRESHOLD = 80;
const DAILY_GOAL      = 10;

export default function DiscoverPage() {
  const [deck,      setDeck]      = useState([...songs]);
  const [offset,    setOffset]    = useState({ x: 0, y: 0 });
  const [dragging,  setDragging]  = useState(false);
  const [animating, setAnimating] = useState(false);
  const [toast,     setToast]     = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [savePop,   setSavePop]   = useState(false);
  const startRef = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { saveSong, discoverProgress, incrementDiscover, streak } = useApp();

  const topSong   = deck[0];
  const topArtist = topSong ? getArtistById(topSong.artistId) : null;

  useEffect(() => () => stopPreview(), []);

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 900);
  };

  const advanceDeck = useCallback(() => {
    setDeck((prev) => (prev.length > 1 ? prev.slice(1) : [...songs]));
    incrementDiscover();
  }, [incrementDiscover]);

  const doSwipe = useCallback((dir) => {
    if (animating || !topSong) return;
    setAnimating(true);
    stopPreview();
    setPlayingId(null);
    if (dir === 'right') { saveSong(topSong); setSavePop(true); setTimeout(() => setSavePop(false), 350); }
    showToast(dir === 'right' ? 'save' : 'skip');
    setOffset({ x: dir === 'right' ? 650 : -650, y: 0 });
    setTimeout(() => {
      setOffset({ x: 0, y: 0 });
      advanceDeck();
      setAnimating(false);
    }, 360);
  }, [animating, topSong, saveSong, advanceDeck]);

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
    const started = playPreview(topSong.previewUrl, topSong.id, () => setPlayingId(null));
    setPlayingId(started ? topSong.id : null);
  };

  const goToArtist = (e) => {
    e.stopPropagation();
    if (topArtist) { stopPreview(); setPlayingId(null); navigate('/artist', { state: { artist: topArtist } }); }
  };

  const rot    = dragging ? (offset.x / 22).toFixed(2) : 0;
  const saveOp = Math.max(0, Math.min(offset.x / 90, 1));
  const skipOp = Math.max(0, Math.min(-offset.x / 90, 1));
  const seen   = discoverProgress.seen;
  const prog   = Math.min((seen / DAILY_GOAL) * 100, 100);

  return (
    <div className="discover-root">
      {/* Logo */}
      <div className="logo-header">
        <div className="logo-mark">
          <span className="logo-gem">◆</span>
          <span className="gradient-text" style={{ fontWeight: 900, fontSize: 22 }}>FindTheGems</span>
        </div>
        <div className="logo-sub">Discover music before it blows up</div>
      </div>

      {/* Progress + streak */}
      <div className="discover-meta">
        <span className="discover-progress-text">{Math.min(seen, DAILY_GOAL)} of {DAILY_GOAL} today</span>
        <div className="discover-progress-bar">
          <div className="discover-progress-fill" style={{ width: `${prog}%` }} />
        </div>
        <div className="streak-badge">🔥 {streak.count}</div>
      </div>

      {/* Deck */}
      <div className="deck-area">
        {toast && <div className={`discover-toast toast-${toast}`}>{toast === 'save' ? '♥ Saved!' : '✕ Skipped'}</div>}

        {/* Back cards */}
        {deck.slice(1, 3).reverse().map((song, i) => {
          const scale = 0.93 - i * 0.025;
          const ty    = (1 - i) * -14;
          return (
            <div key={song.id} className="song-card"
              style={{ transform: `scale(${scale}) translateY(${ty}px)`, zIndex: i, pointerEvents: 'none', aspectRatio: '3/4.2' }}>
              <div className="song-card-img" style={{ backgroundImage: `url(${song.coverArt})` }} />
              <div className="song-card-overlay" />
            </div>
          );
        })}

        {/* Top card */}
        {topSong && (
          <div
            key={topSong.id}
            className="song-card"
            style={{
              transform: `translate(${offset.x}px,${offset.y}px) rotate(${rot}deg)`,
              transition: dragging ? 'none' : 'transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94)',
              zIndex: 5,
              aspectRatio: '3/4.2',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="song-card-img" style={{ backgroundImage: `url(${topSong.coverArt})` }} />
            <div className="song-card-overlay" />

            {/* Artist corner photo */}
            {topArtist && (
              <img src={topArtist.photo} alt={topArtist.name} className="song-card-artist-photo" />
            )}

            {/* SAVE / SKIP stamps */}
            <div className="swipe-stamp stamp-save" style={{ opacity: saveOp }}>SAVE</div>
            <div className="swipe-stamp stamp-skip" style={{ opacity: skipOp }}>SKIP</div>

            <div className="song-card-body">
              <div className="song-card-chips">
                <span className="chip chip-genre">{topSong.genre}</span>
                <span className="chip chip-mood">{topSong.mood}</span>
              </div>
              <div className="song-card-title">{topSong.title}</div>
              <div className="song-card-artist" onClick={goToArtist}>{topArtist?.name}</div>
              <div className="song-card-listeners">
                <span className="listeners-dot" />
                {formatListeners(topSong.monthlyListeners)} monthly listeners
              </div>
              <button className="song-card-play" onClick={handlePlay}>
                {playingId === topSong.id ? '⏹ Stop Preview' : '▶ Play Preview'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="deck-actions">
        <button className="action-btn action-skip" onClick={() => doSwipe('left')} aria-label="Skip">✕</button>
        <button className={`action-btn action-save${savePop ? ' saved' : ''}`} onClick={() => doSwipe('right')} aria-label="Save">♥</button>
      </div>
    </div>
  );
}
