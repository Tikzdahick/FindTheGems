import { useEffect, useState } from 'react';
import { generateShareCard } from '../utils/shareCard';
import { getArtistById } from '../data/mockData';

export default function ShareModal({ song, artistOverride, onClose }) {
  const [dataUrl, setDataUrl]     = useState(null);
  const [copied,  setCopied]      = useState(false);
  const [loading, setLoading]     = useState(true);

  const artist = artistOverride || (song?.artistId ? getArtistById(song.artistId) : null);

  useEffect(() => {
    if (!song) return;
    generateShareCard(song, artist)
      .then((canvas) => setDataUrl(canvas.toDataURL('image/png')))
      .catch(() => setDataUrl(null))
      .finally(() => setLoading(false));
  }, [song?.id]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href     = dataUrl;
    a.download = `${(song.title || 'gem').replace(/\s+/g, '_')}_FindTheGems.png`;
    a.click();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const tweetText = encodeURIComponent(
    `🎵 Just discovered "${song?.title}" by ${artist?.name || song?.artistName} on FindTheGems — criminally underrated. Check it out! ${window.location.origin}`
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" style={{ maxWidth: 430 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Share this <span className="gradient-text">Gem</span></div>

        {/* Card preview */}
        <div style={{ marginBottom: 20, borderRadius: 16, overflow: 'hidden', background: 'var(--surface-2)' }}>
          {loading ? (
            <div className="shimmer" style={{ height: 200 }} />
          ) : dataUrl ? (
            <img src={dataUrl} alt="Share card" style={{ width: '100%', display: 'block' }} />
          ) : (
            <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 32 }}>◆</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{song?.title}</p>
              <p style={{ fontSize: 13, color: 'var(--purple-light)' }}>{artist?.name || song?.artistName}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dataUrl && (
            <button className="btn btn-purple" style={{ width: '100%' }} onClick={download}>
              ⬇ Download Image
            </button>
          )}
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={copyLink}>
            {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noreferrer"
            className="btn"
            style={{ width: '100%', background: '#000', color: '#fff', textDecoration: 'none', justifyContent: 'center' }}
          >
            ✕ Post on X
          </a>
        </div>

        <button
          className="btn btn-ghost"
          style={{ width: '100%', marginTop: 10, color: 'var(--text-muted)' }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
