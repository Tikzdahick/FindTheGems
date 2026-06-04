// Web Audio API — generates real musical chords, no external files needed

let ctx = null;
let masterGain = null;
let currentSongId = null;
let autoStopTimer = null;
let endCallback = null;

function getCtx() {
  if (!ctx || ctx.state === 'closed') {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// ── Chord library — one per mood ──────────────────────────────────────────────
// Frequencies: [bass, chord tone, chord tone, chord tone, top]
// Bass is always sine for warmth; upper voices use the wave type for character.
const CHORDS = {
  'Chill':       { freqs: [130.81, 261.63, 329.63, 392.00, 493.88], wave: 'sine'     }, // Cmaj7
  'Dreamy':      { freqs: [174.61, 261.63, 349.23, 440.00, 523.25], wave: 'sine'     }, // Fmaj
  'Melancholic': { freqs: [110.00, 164.81, 196.00, 261.63, 329.63], wave: 'triangle' }, // Am7
  'Hype':        { freqs: [146.83, 220.00, 293.66, 369.99, 587.33], wave: 'sawtooth' }, // Dmaj
  'Late Night':  { freqs: [116.54, 174.61, 207.65, 277.18, 466.16], wave: 'sine'     }, // Bbm7
  'Feel Good':   { freqs: [130.81, 196.00, 261.63, 329.63, 392.00], wave: 'triangle' }, // Cmaj
  'Focused':     { freqs: [164.81, 246.94, 329.63, 415.30, 493.88], wave: 'sine'     }, // Emaj
  'Sad Hours':   { freqs: [123.47, 185.00, 246.94, 293.66, 369.99], wave: 'sine'     }, // Bm
  'Sensual':     { freqs: [185.00, 277.18, 329.63, 440.00, 554.37], wave: 'sine'     }, // F#maj7
  'Intense':     { freqs: [130.81, 196.00, 311.13, 392.00, 493.88], wave: 'sawtooth' }, // Cm
  'Euphoric':    { freqs: [220.00, 277.18, 329.63, 415.30, 440.00], wave: 'triangle' }, // Amaj7
};

const DURATION = 4.5; // seconds

// ── Public API ────────────────────────────────────────────────────────────────

export function stopPreview(silent = false) {
  clearTimeout(autoStopTimer);
  autoStopTimer = null;

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

export function playPreview(songId, mood, onEnd) {
  // Toggle off if same song is already playing
  if (currentSongId === songId) {
    stopPreview();
    return false;
  }

  // Stop anything that was playing (silently — don't fire its onEnd)
  stopPreview(true);

  // ── Claim the UI slot FIRST ───────────────────────────────────────────────
  // This ensures the button flips to "Stop Preview" immediately, even if the
  // AudioContext takes a moment to resume or isn't available in this env.
  currentSongId = songId;
  endCallback   = onEnd;
  autoStopTimer = setTimeout(() => {
    currentSongId = null;
    masterGain    = null;
    const cb = endCallback;
    endCallback   = null;
    cb?.();
  }, (DURATION + 0.1) * 1000);

  // ── Build the chord (best-effort — silent failure is fine) ────────────────
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return true;

    const c = getCtx();
    const now = c.currentTime;
    const { freqs, wave } = CHORDS[mood] || CHORDS['Chill'];

    // Dynamics compressor prevents clipping
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value      = 10;
    comp.ratio.value     = 5;
    comp.attack.value    = 0.004;
    comp.release.value   = 0.3;
    comp.connect(c.destination);

    // Master gain with ADSR envelope
    masterGain = c.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.55, now + 0.3);        // attack
    masterGain.gain.setValueAtTime(0.55, now + DURATION - 1.2);      // sustain
    masterGain.gain.linearRampToValueAtTime(0, now + DURATION);       // release
    masterGain.connect(comp);

    // Delay reverb (wet path)
    const delay    = c.createDelay(0.6);
    const feedback = c.createGain();
    const wetGain  = c.createGain();
    delay.delayTime.value = 0.28;
    feedback.gain.value   = 0.38;
    wetGain.gain.value    = 0.22;
    masterGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);    // feedback loop
    delay.connect(wetGain);
    wetGain.connect(comp);

    // One oscillator per chord tone, staggered 70ms for a gentle arpeggio
    freqs.forEach((freq, i) => {
      const osc     = c.createOscillator();
      const oscGain = c.createGain();
      osc.type            = i === 0 ? 'sine' : wave; // bass always sine
      osc.frequency.value = freq;
      osc.detune.value    = i === 0 ? 0 : (i % 2 === 0 ? 4 : -4); // subtle chorus
      oscGain.gain.value  = i === 0 ? 0.65 : 0.3;
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now + i * 0.07);
      osc.stop(now + DURATION + 0.3);
    });
  } catch {
    // Audio failed; UI state is already set, auto-stop timer will clean up
  }

  return true;
}

export const getCurrentSongId = () => currentSongId;
