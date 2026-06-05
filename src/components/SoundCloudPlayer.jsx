// Bottom-sheet SoundCloud embed player.
// soundcloudUrl should be the direct track URL (e.g. soundcloud.com/lackvill/batman-robin)
// so the widget plays that specific song.
// BashfortheWorld has no profile — opens YouTube search instead.
// 1up Tee "Literally Doe" uses the artist page (track not publicly listed).

const IS_SEARCH_URL = (url) => !url || url.includes('/search?') || url === '#';

export default function SoundCloudPlayer({ soundcloudUrl, artistName, songTitle, onClose }) {
  if (IS_SEARCH_URL(soundcloudUrl)) {
    const query = songTitle ? `${songTitle} ${artistName}` : artistName;
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
    return null;
  }

  const embedSrc =
    'https://w.soundcloud.com/player/?' +
    new URLSearchParams({
      url:           soundcloudUrl,
      auto_play:     'true',
      hide_related:  'true',
      show_comments: 'false',
      show_user:     'false',
      show_reposts:  'false',
      visual:        'false',
      color:         '7c3aed',
    }).toString();

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ alignItems: 'flex-end' }}
    >
      <div
        className="modal-sheet"
        style={{ maxWidth: 430, paddingBottom: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-handle" />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ minWidth: 0 }}>
            {songTitle && (
              <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {songTitle}
              </p>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {artistName} · on SoundCloud 🎵
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0, marginLeft: 12,
              background: 'var(--glass)', border: '1px solid var(--glass-border)',
              borderRadius: '50%', width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* SoundCloud widget */}
        <iframe
          src={embedSrc}
          width="100%"
          height="120"
          frameBorder="0"
          allow="autoplay"
          style={{ borderRadius: 10, display: 'block' }}
          title={songTitle ? `${songTitle} by ${artistName}` : artistName}
        />

        {/* Open on SoundCloud */}
        <a
          href={soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center', marginTop: 14,
            fontSize: 13, color: 'var(--purple-light)', fontWeight: 600, textDecoration: 'none',
          }}
        >
          Open on SoundCloud ↗
        </a>
      </div>
    </div>
  );
}
