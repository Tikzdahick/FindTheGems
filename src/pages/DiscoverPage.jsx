import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { songs, getArtistById } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { playPreview, stopPreview, getCurrentSongId } from '../utils/audio';

const SWIPE_THRESHOLD = 80;

function formatListeners(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

// A single card in the deck (not the active draggable one)
function BackCard({ song, scale, translateY }) {
  return (
    <div
      className="song-card-wrap"
      style={{ transform: `scale(${scale}) translateY(${translateY}px)`, zIndex: 0, pointerEvents: 'none' }}
    >
      <div className="song-card-bg" style={{ backgroundImage: `url(${song.coverArt})` }} />
      <div className="song-card-overlay" />
    </div>
  );
}

export default function DiscoverPage() {
  const [deck, setDeck] = useState([...songs]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [toast, setToast] = useState(null); // 'save' | 'skip' | null
  const [playingId, setPlayingId] = useState(null);
  const startRef = useRef({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { saveSong } = useApp();

  const topSong = deck[0];
  const topArtist = topSong ? getArtistById(topSong.artistId) : null;

  // Stop audio when song changes
  useEffect(() => {
    return () => stopPreview();
  }, []);

  const showToast = (type) => {
    setToast(type);
    setTimeout(() => setToast(null), 900);
  };

  const advanceDeck = useCallback(() => {
    setDeck((prev) => (prev.length > 1 ? prev.slice(1) : [...songs]));
  }, []);

  const doSwipe = useCallback((direction) => {
    if (animating || !topSong) return;
    setAnimating(true);
    stopPreview();
    setPlayingId(null);
    if (direction === 'right') saveSong(topSong);
    showToast(direction === 'right' ? 'save' : 'skip');
    setOffset({ x: direction === 'right' ? 600 : -600, y: 0 });
    setTimeout(() => {
      setOffset({ x: 0, y: 0 });
      advanceDeck();
      setAnimating(false);
    }, 350);
  }, [animating, topSong, saveSong, advanceDeck]);

  // Pointer events for drag (works for mouse & touch)
  const onPointerDown = (e) => {
    if (animating) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - startRef.current.x,
      y: (e.clientY - startRef.current.y) * 0.25,
    });
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    if (offset.x > SWIPE_THRESHOLD) doSwipe('right');
    else if (offset.x < -SWIPE_THRESHOLD) doSwipe('left');
    else setOffset({ x: 0, y: 0 }); // snap back
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!topSong) return;
    const started = playPreview(topSong.previewUrl, topSong.id, () => setPlayingId(null));
    setPlayingId(started ? topSong.id : null);
  };

  const handleArtistClick = (e) => {
    e.stopPropagation();
    if (!topArtist) return;
    stopPreview();
    setPlayingId(null);
    navigate('/artist', { state: { artist: topArtist } });
  };

  const rotation = dragging ? (offset.x / 22).toFixed(2) : 0;
  const saveAlpha = Math.max(0, Math.min(offset.x / 100, 1));
  const skipAlpha = Math.max(0, Math.min(-offset.x / 100, 1));

  const topStyle = {
    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
    transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    zIndex: 5,
    cursor: dragging ? 'grabbing' : 'grab',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div className="logo-header">
        <div className="logo-text"><span className="logo-gem">◆</span> FindTheGems</div>
        <div className="logo-sub">Hidden music, discovered daily</div>
      </div>

      {/* Deck */}
      <div className="deck-area">
        {toast && (
          <div className={`toast toast-${toast}`}>
            {toast === 'save' ? '♥ Saved!' : '✕ Skipped'}
          </div>
        )}

        {/* Back cards */}
        {deck.slice(1, 3).reverse().map((song, i) => (
          <BackCard key={song.id} song={song} scale={0.95 - i * 0.02} translateY={(1 - i) * -10} />
        ))}

        {/* Top draggable card */}
        {topSong && (
          <div
            key={topSong.id}
            className="song-card-wrap"
            style={topStyle}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="song-card-bg" style={{ backgroundImage: `url(${topSong.coverArt})` }} />
            <div className="song-card-overlay" />

            {/* SAVE / SKIP labels */}
            <div className="swipe-hints">
              <div className="swipe-label swipe-save" style={{ opacity: saveAlpha }}>♥ SAVE</div>
              <div className="swipe-label swipe-skip" style={{ opacity: skipAlpha }}>✕ SKIP</div>
            </div>

            <div className="song-card-content">
              <div className="song-card-tags">
                <span className="chip chip-genre">{topSong.genre}</span>
                <span className="chip chip-mood">{topSong.mood}</span>
              </div>
              <div className="song-card-title">{topSong.title}</div>
              <div className="song-card-artist" onClick={handleArtistClick}>{topArtist?.name}</div>
              <div className="song-card-listeners">
                <span className="listeners-dot">◆</span>
                {formatListeners(topSong.monthlyListeners)} monthly listeners
              </div>
              <button className="song-card-play" onClick={handlePlay}>
                <span>{playingId === topSong.id ? '⏹' : '▶'}</span>
                <span>{playingId === topSong.id ? 'Stop Preview' : 'Play Preview'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="deck-actions">
        <button className="action-btn action-skip" onClick={() => doSwipe('left')} aria-label="Skip">✕</button>
        <button className="action-btn action-save" onClick={() => doSwipe('right')} aria-label="Save">♥</button>
      </div>
    </div>
  );
}
