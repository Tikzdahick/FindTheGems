// Simple audio player — no API calls, no tokens, no Web Audio synthesis.
// Plays previewUrl directly via an HTML Audio element.
// archive.org URLs are served with Access-Control-Allow-Origin: * so no CORS issues.

let currentAudio = null;
let currentSongId = null;

export function stopPreview(silent = false) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  currentSongId = null;
}

// moodOrPreviewUrl: a real https:// URL → plays it; anything else → no-op (returns false)
export function playPreview(songId, previewUrl, onEnd) {
  // Toggle off if the same song is already playing
  if (currentSongId === songId) {
    stopPreview();
    return false;
  }

  // Stop whatever was playing
  stopPreview();

  if (!previewUrl || !previewUrl.startsWith('http')) {
    console.warn('[Audio] No previewUrl for song', songId);
    return false;
  }

  const audio = new Audio(previewUrl);
  audio.volume = 0.85;

  audio.addEventListener('ended', () => {
    currentSongId = null;
    currentAudio  = null;
    onEnd?.();
  });

  audio.play().catch(err => {
    console.error('[Audio] Playback failed:', err.message);
    currentSongId = null;
    currentAudio  = null;
    onEnd?.();
  });

  currentAudio  = audio;
  currentSongId = songId;
  return true;
}

export const getCurrentSongId = () => currentSongId;
