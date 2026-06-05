import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const IS_GOOGLE_CONFIGURED = !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your_google_client_id_here');

export default function AuthScreen() {
  const { login } = useApp();
  const btnRef    = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [error, setError] = useState('');

  // Wait for the GIS script to load, then initialize
  useEffect(() => {
    if (!IS_GOOGLE_CONFIGURED) return;

    const init = () => {
      if (!window.google?.accounts?.id) { setTimeout(init, 150); return; }
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        if (btnRef.current) {
          window.google.accounts.id.renderButton(btnRef.current, {
            theme: 'filled_black',
            size: 'large',
            width: 300,
            shape: 'pill',
          });
        }
        setGoogleReady(true);
      } catch (e) {
        setError('Google Sign In failed to load.');
      }
    };
    init();
  }, []);

  const handleGoogleResponse = (response) => {
    try {
      // Decode the JWT without a library
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      login({
        id:       payload.sub,
        name:     payload.name,
        email:    payload.email,
        photo:    payload.picture,
        provider: 'google',
      });
    } catch {
      setError('Failed to sign in. Please try again.');
    }
  };

  const continueAsGuest = () => {
    login({
      id:       `guest_${Date.now()}`,
      name:     'Guest',
      email:    null,
      photo:    null,
      provider: 'guest',
    });
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg)',
      display: 'flex', justifyContent: 'center', alignItems: 'stretch', zIndex: 999,
    }}>
      <div style={{
        width: '100%', maxWidth: 430, height: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 32px', textAlign: 'center',
        position: 'relative', background: 'var(--bg)',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 300,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div className="gem-pulse" style={{ fontSize: 64, marginBottom: 24 }}>◆</div>
        <h1 className="gradient-text" style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1px', marginBottom: 10 }}>
          FindTheGems
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 48, maxWidth: 260 }}>
          Discover music <strong style={{ color: 'var(--text)' }}>before it blows up.</strong><br />
          Artists under 1M listeners, curated for you.
        </p>

        {/* Google Sign In */}
        {IS_GOOGLE_CONFIGURED ? (
          <div style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {/* GIS renders the button here */}
            <div ref={btnRef} style={{ minHeight: 44 }} />
            {!googleReady && (
              <div style={{ fontSize: 13, color: 'var(--text-dim)', height: 44, display: 'flex', alignItems: 'center' }}>
                Loading Google Sign In…
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 20, padding: '12px 20px', borderRadius: 14, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 13, color: 'var(--text-muted)', maxWidth: 300 }}>
            Add <code style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>VITE_GOOGLE_CLIENT_ID</code> to <code style={{ color: 'var(--gold)', fontFamily: 'monospace' }}>.env</code> to enable Google Sign In.
          </div>
        )}

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 300, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Guest */}
        <button className="btn btn-ghost" style={{ width: '100%', maxWidth: 300 }} onClick={continueAsGuest}>
          Continue as Guest
        </button>

        {error && (
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--danger)' }}>{error}</p>
        )}

        <p style={{ position: 'absolute', bottom: 32, fontSize: 12, color: 'var(--text-dim)' }}>
          Your data stays on this device
        </p>
      </div>
    </div>
  );
}
