// Audio player — plays Spotify 30s preview URLs when available,
// falls back to Web Audio API chord synthesis when not.

let ctx           = null;
let masterGain    = null;
let currentAudioEl = null;
let currentSongId = null;
let autoStopTimer = null;
let endCallback   = null;

function getCtx() {
  if (!ctx || ctx.state === 'closed') {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ── Chord library (mood → frequencies) ───────────────────────────────────────
const CHORDS = {
  'Chill':       { freqs: [130.81, 261.63, 329.63, 392.00, 493.88], wave: 'sine'     },
  'Dreamy':      { freqs: [174.61, 261.63, 349.23, 440.00, 523.25], wave: 'sine'     },
  'Melancholic': { freqs: [110.00, 164.81, 196.00, 261.63, 329.63], wave: 'triangle' },
  'Hype':        { freqs: [146.83, 220.00, 293.66, 369.99, 587.33], wave: 'sawtooth' },
  'Late Night':  { freqs: [116.54, 174.61, 207.65, 277.18, 466.16], wave: 'sine'     },
  'Feel Good':   { freqs: [130.81, 196.00, 261.63, 329.63, 392.00], wave: 'triangle' },
  'Focused':     { freqs: [164.81, 246.94, 329.63, 415.30, 493.88], wave: 'sine'     },
  'Sad Hours':   { freqs: [123.47, 185.00, 246.94, 293.66, 369.99], wave: 'sine'     },
  'Sensual':     { freqs: [185.00, 277.18, 329.63, 440.00, 554.37], wave: 'sine'     },
  'Intense':     { freqs: [130.81, 196.00, 311.13, 392.00, 493.88], wave: 'sawtooth' },
  'Euphoric':    { freqs: [220.00, 277.18, 329.63, 415.30, 440.00], wave: 'triangle' },
};
const SYNTH_DURATION = 4.5;

// ── Stop everything ───────────────────────────────────────────────────────────
export function stopPreview(silent = false) {
  clearTimeout(autoStopTimer);
  autoStopTimer = null;

  // Stop real audio element
  if (currentAudioEl) {
    currentAudioEl.pause();
    currentAudioEl.src = '';
    currentAudioEl = null;
  }

  // Fade out synthesizer
  if (masterGain && ctx) {
    try {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.linearRampToValueAtTime(0, now + 0.08);
      const mg = masterGain;
      setTimeout(() => { try { mg.disconnect(); } catch {} }, 200);
    } catch {}
  }
  masterGain = null;
  currentSongId = null;

  if (!silent && endCallback) endCallback();
  endCallback = null;
}

// ── Play ──────────────────────────────────────────────────────────────────────
// moodOrPreviewUrl:
//   - 'https://...'  → play the Spotify 30s preview MP3
//   - 'Chill' etc.   → synthesize a chord for that mood
export function playPreview(songId, moodOrPreviewUrl, onEnd) {
  if (currentSongId === songId) { stopPreview(); return false; }
  stopPreview(true);

  currentSongId = songId;
  endCallback   = onEnd;

  const isUrl = typeof moodOrPreviewUrl === 'string' && moodOrPreviewUrl.startsWith('https://');
  const dur   = isUrl ? 30 : SYNTH_DURATION;

  autoStopTimer = setTimeout(() => {
    currentSongId = null; masterGain = null; currentAudioEl = null;
    const cb = endCallback; endCallback = null; cb?.();
  }, (dur + 0.5) * 1000);

  if (isUrl) {
    playUrl(moodOrPreviewUrl);
  } else {
    playSynth(moodOrPreviewUrl || 'Chill');
  }

  return true;
}

// ── Real audio via HTML Audio element ─────────────────────────────────────────
function playUrl(url) {
  try {
    const el = new Audio(url);
    currentAudioEl = el;
    el.volume = 0.8;
    el.addEventListener('ended', () => {
      clearTimeout(autoStopTimer); autoStopTimer = null;
      currentSongId = null; currentAudioEl = null;
      const cb = endCallback; endCallback = null; cb?.();
    });
    el.play().catch(() => playSynth('Chill')); // fall back on autoplay block
  } catch {
    playSynth('Chill');
  }
}

// ── Web Audio synthesis ───────────────────────────────────────────────────────
function playSynth(mood) {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    const c   = getCtx();
    const now = c.currentTime;
    const { freqs, wave } = CHORDS[mood] || CHORDS['Chill'];

    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 10;
    comp.ratio.value = 5; comp.attack.value = 0.004; comp.release.value = 0.3;
    comp.connect(c.destination);

    masterGain = c.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.55, now + 0.3);
    masterGain.gain.setValueAtTime(0.55, now + SYNTH_DURATION - 1.2);
    masterGain.gain.linearRampToValueAtTime(0, now + SYNTH_DURATION);
    masterGain.connect(comp);

    const delay = c.createDelay(0.6); const fb = c.createGain(); const wet = c.createGain();
    delay.delayTime.value = 0.28; fb.gain.value = 0.38; wet.gain.value = 0.22;
    masterGain.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(comp);

    freqs.forEach((freq, i) => {
      const osc = c.createOscillator(); const og = c.createGain();
      osc.type = i === 0 ? 'sine' : wave;
      osc.frequency.value = freq;
      osc.detune.value    = i === 0 ? 0 : (i % 2 === 0 ? 4 : -4);
      og.gain.value = i === 0 ? 0.65 : 0.3;
      osc.connect(og); og.connect(masterGain);
      osc.start(now + i * 0.07); osc.stop(now + SYNTH_DURATION + 0.3);
    });
  } catch {}
}

export const getCurrentSongId = () => currentSongId;
