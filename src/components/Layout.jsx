import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { stopPreview } from '../utils/audio';
import { useApp } from '../context/AppContext';

const TABS = [
  { path: '/',          label: 'Discover',  icon: '◆',  iconOff: '◇'  },
  { path: '/community', label: 'Community', icon: '◉',  iconOff: '○'  },
  { path: '/search',    label: 'Search',    icon: '⬡',  iconOff: '⬡'  },
  { path: '/saved',     label: 'Saved',     icon: '♥',  iconOff: '♡'  },
  { path: '/profile',   label: 'Profile',   icon: '👤', iconOff: '👤' },
];

function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function NotificationPanel({ notifications, onMarkRead, onClear, onClose }) {
  return (
    <div
      style={{
        position: 'absolute', top: 52, right: 12, zIndex: 30,
        width: 300, maxHeight: 360, overflowY: 'auto',
        background: '#1a1a22', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        scrollbarWidth: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px 10px' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Notifications</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onMarkRead} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--purple-light)', fontWeight: 600 }}>Mark read</button>
          <button onClick={onClear}   style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>Clear</button>
        </div>
      </div>
      {notifications.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: 13, padding: '20px 16px' }}>No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <div key={n.id} style={{
            padding: '10px 16px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: n.read ? 'transparent' : 'rgba(124,58,237,0.06)',
          }}>
            <div style={{ fontSize: 14, fontWeight: n.read ? 400 : 700, color: 'var(--text)', marginBottom: 2 }}>{n.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{n.body}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{timeAgo(n.timestamp)}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { notifications, unreadCount, markAllRead, clearNotifs } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  const activeBase = pathname === '/artist' ? null : pathname;

  const goTo = (path) => {
    if (path !== pathname) { stopPreview(); navigate(path); }
    setNotifOpen(false);
  };

  return (
    <div className="app-shell" onClick={() => notifOpen && setNotifOpen(false)}>
      {/* Notification bell */}
      <button
        onClick={(e) => { e.stopPropagation(); setNotifOpen((o) => !o); if (!notifOpen) markAllRead(); }}
        style={{
          position: 'absolute', top: 14, right: 14, zIndex: 25,
          background: notifOpen ? 'rgba(124,58,237,0.25)' : 'rgba(10,10,10,0.7)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${unreadCount > 0 ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 999, padding: '6px 10px',
          cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', gap: 5,
          transition: 'all 0.2s',
        }}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            background: 'var(--gold)', color: '#0a0a0a',
            fontSize: 10, fontWeight: 800, borderRadius: 999,
            minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {notifOpen && (
        <NotificationPanel
          notifications={notifications}
          onMarkRead={() => { markAllRead(); }}
          onClear={() => { clearNotifs(); setNotifOpen(false); }}
          onClose={() => setNotifOpen(false)}
        />
      )}

      <div className="screen">{children}</div>

      <nav className="tab-bar">
        {TABS.map((tab) => {
          const active = activeBase === tab.path;
          return (
            <button key={tab.path} className={`tab-btn${active ? ' active' : ''}`} onClick={() => goTo(tab.path)}>
              <span className="tab-icon">{active ? tab.icon : tab.iconOff}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
