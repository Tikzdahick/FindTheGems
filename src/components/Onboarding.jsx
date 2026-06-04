import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ALL_GENRES, ALL_MOODS } from '../data/mockData';

const TOTAL_SCREENS = 4;

export default function Onboarding() {
  const { completeOnboarding } = useApp();
  const [screen,   setScreen]   = useState(0);
  const [dir,      setDir]      = useState('forward'); // for slide animation tracking
  const [genres,   setGenres]   = useState([]);
  const [moods,    setMoods]    = useState([]);
  const [username, setUsername] = useState('');
  const [avatar,   setAvatar]   = useState(null);
  const fileRef = useRef();

  const goNext = () => { setDir('forward'); setScreen((s) => s + 1); };
  const goBack = () => { setDir('back');    setScreen((s) => s - 1); };

  const toggleGenre = (id) => setGenres((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleMood  = (id) => setMoods((p)  => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleComplete = () => {
    completeOnboarding({
      username: username.trim() || 'GemHunter',
      avatar,
      selectedGenres: genres,
      selectedMoods:  moods,
    });
  };

  const slideClass = (idx) => {
    if (idx === screen)     return 'ob-slide active';
    if (idx  < screen)      return 'ob-slide exiting';
    return 'ob-slide entering';
  };

  const initials = username.trim() ? username.trim()[0].toUpperCase() : '?';

  return (
    <div className="onboarding-root">
      <div className="onboarding-inner">
        <div className="ob-slides">

          {/* ── Screen 0: Intro ─────────────────────────────────────────── */}
          <div className={slideClass(0)}>
            <div className="ob-intro" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div className="ob-gem">◆</div>
              <div className="ob-logo gradient-text">FindTheGems</div>
              <p className="ob-tagline">
                Discover music <strong>before it blows up.</strong><br />
                Artists under 1M listeners, curated for you.
              </p>
              <button className="btn btn-purple" style={{ padding: '15px 40px', fontSize: 16 }} onClick={goNext}>
                Get Started →
              </button>
              <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-dim)' }}>
                Takes 30 seconds to set up
              </p>
            </div>
          </div>

          {/* ── Screen 1: Genres ────────────────────────────────────────── */}
          <div className={slideClass(1)} style={{ overflowY: 'auto' }}>
            <div className="ob-heading">What's your<br /><span className="gradient-text">sound?</span></div>
            <p className="ob-sub">Pick the genres you love — we'll tailor your feed.</p>
            <div className="ob-grid">
              {ALL_GENRES.map((g) => (
                <button
                  key={g.id}
                  className={`ob-chip${genres.includes(g.id) ? ' selected' : ''}`}
                  onClick={() => toggleGenre(g.id)}
                >
                  <span className="ob-chip-emoji">{g.emoji}</span>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Screen 2: Moods ─────────────────────────────────────────── */}
          <div className={slideClass(2)} style={{ overflowY: 'auto' }}>
            <div className="ob-heading">How do you<br /><span className="gradient-text">vibe?</span></div>
            <p className="ob-sub">Pick the moods that fit your listening sessions.</p>
            <div className="ob-mood-grid">
              {ALL_MOODS.map((m) => (
                <button
                  key={m.id}
                  className={`ob-mood-chip${moods.includes(m.id) ? ' selected' : ''}`}
                  onClick={() => toggleMood(m.id)}
                >
                  <span className="ob-mood-emoji">{m.emoji}</span>
                  <span className="ob-mood-label">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Screen 3: Profile ───────────────────────────────────────── */}
          <div className={slideClass(3)}>
            <div className="ob-heading" style={{ marginTop: 40 }}>Last step.<br /><span className="gradient-text">Who are you?</span></div>
            <p className="ob-sub">Set up your profile so the community knows you.</p>

            <input type="file" accept="image/*" ref={fileRef} onChange={handleAvatarFile} style={{ display: 'none' }} />

            <div
              className="ob-avatar-upload"
              onClick={() => fileRef.current.click()}
              style={{ background: avatar ? 'transparent' : 'var(--surface-2)' }}
            >
              {avatar
                ? <img src={avatar} alt="avatar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : <>
                    <div className="ob-avatar-plus">+</div>
                    <div className="ob-avatar-hint">Photo</div>
                  </>
              }
            </div>

            {!avatar && username.trim() && (
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-purple)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 auto 8px',
                }}>
                  {initials}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>or tap the circle to upload a photo</p>
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label className="field-label">Username</label>
              <input
                className="input"
                placeholder="e.g. velvetears, lo_fi_hunter…"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
                onKeyDown={(e) => e.key === 'Enter' && handleComplete()}
              />
            </div>
          </div>
        </div>

        {/* ── Footer: dots + CTA ──────────────────────────────────────── */}
        <div className="ob-footer">
          <div className="ob-dots">
            {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
              <div key={i} className={`ob-dot${screen === i ? ' active' : ''}`} />
            ))}
          </div>

          {screen === 0 ? null : screen === TOTAL_SCREENS - 1 ? (
            <button className="btn btn-gold" style={{ width: '100%', padding: '15px' }} onClick={handleComplete}>
              Start Discovering ◆
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
              {screen > 0 && (
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={goBack}>← Back</button>
              )}
              <button className="btn btn-purple" style={{ flex: 2 }} onClick={goNext}>
                {screen === 1 && genres.length === 0 ? 'Skip →' : screen === 2 && moods.length === 0 ? 'Skip →' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
