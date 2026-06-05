// Bottom-sheet SoundCloud embed player.
// For artists with a real SoundCloud profile, shows the SC widget iframe.
// For artists with only a search URL (BashfortheWorld), opens a YouTube search tab.

const IS_SEARCH_URL = (url) => !url || url.includes('/search?') || url === '#';

export default function SoundCloudPlayer({ soundcloudUrl, artistName, onClose }) {
  if (IS_SEARCH_URL(soundcloudUrl)) {
    // Open YouTube search and close immediately — no bottom sheet needed
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(artistName)}`,
      '_blank',
      'noopener,noreferrer'
    );
    onClose();
    return null;
  }

  // Encode the profile URL for the SC widget
  const embedSrc =
    'https://w.soundcloud.com/player/?' +
    new URLSearchParams({
      url:           soundcloudUrl,
      auto_play:     'true',
      hide_related:  'true',
      show_comments: 'false',
      show_user:     'true',
      show_reposts:  'false',
      visual:        'false',
      color:         '7c3aed',   // purple — hex without #
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
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16,
        }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>{artistName}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              🎵 on SoundCloud
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
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
          title={`${artistName} on SoundCloud`}
        />

        {/* Open full profile link */}
        <a
          href={soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block', textAlign: 'center', marginTop: 14,
            fontSize: 13, color: 'var(--purple-light)', fontWeight: 600, textDecoration: 'none',
          }}
        >
          Open full profile on SoundCloud ↗
        </a>
      </div>
    </div>
  );
}
