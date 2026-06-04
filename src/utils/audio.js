let currentAudio = null;
let currentSongId = null;

export function playPreview(url, songId, onEnd) {
  if (currentSongId === songId) {
    stopPreview();
    return false;
  }
  stopPreview();
  try {
    currentAudio = new Audio(url);
    currentAudio.addEventListener('ended', () => {
      currentSongId = null;
      onEnd?.();
    });
    currentAudio.play().catch(() => {});
    currentSongId = songId;
    return true;
  } catch {
    return false;
  }
}

export function stopPreview() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
    currentSongId = null;
  }
}

export const getCurrentSongId = () => currentSongId;
