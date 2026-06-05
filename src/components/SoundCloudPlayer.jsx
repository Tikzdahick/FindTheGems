// Bottom-sheet SoundCloud embed player.
//
// scEmbedUrl: api.soundcloud.com/tracks/{id} — obtained from SoundCloud's own
//   oEmbed API. Using the track ID (not the human URL) is what SoundCloud
//   recommends and is what loads reliably in their widget.
//
// soundcloudUrl: human URL, used for the "Open on SoundCloud" link only.
//
// spotifyFallback: when no scEmbedUrl, opens Spotify artist page in new tab.

export default function SoundCloudPlayer({ scEmbedUrl, soundcloudUrl, spotifyFallback, artistName, songTitle, onClose }) {
  // No SC embed available — open Spotify instead
  if (!scEmbedUrl) {
    const target = spotifyFallback || soundcloudUrl;
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
    onClose();
    return null;
  }

  // Build embed src exactly as SoundCloud's oEmbed generates it,
  // using encodeURIComponent on the api.soundcloud.com/tracks/{id} URL.
  const embedSrc = [
    'https://w.soundcloud.com/player/?url=',
    encodeURIComponent(scEmbedUrl),
    '&auto_play=true',
    '&hide_related=true',
    '&show_comments=false',
    '&show_user=false',
    '&show_reposts=false',
    '&visual=false',
    '&color=7c3aed',
  ].join('');

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

        {/* SoundCloud widget — key forces remount when track changes */}
        <iframe
          key={scEmbedUrl}
          src={embedSrc}
          width="100%"
          height="120"
          frameBorder="0"
          allow="autoplay"
          style={{ borderRadius: 10, display: 'block' }}
          title={songTitle ? `${songTitle} by ${artistName}` : artistName}
        />

        {/* Open on SoundCloud */}
        {soundcloudUrl && (
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
        )}
      </div>
    </div>
  );
}
