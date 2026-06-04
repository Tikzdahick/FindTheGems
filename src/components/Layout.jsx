import { useNavigate, useLocation } from 'react-router-dom';
import { stopPreview } from '../utils/audio';

const TABS = [
  { path: '/',          label: 'Discover',  icon: '◆', iconOff: '◇' },
  { path: '/community', label: 'Community', icon: '◉', iconOff: '○' },
  { path: '/search',    label: 'Search',    icon: '⬡', iconOff: '⬡' },
  { path: '/saved',     label: 'Saved',     icon: '♥', iconOff: '♡' },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // treat /artist as part of whichever tab launched it — keep that tab highlighted
  const activeBase = pathname === '/artist' ? null : pathname;

  const goTo = (path) => {
    if (path !== pathname) {
      stopPreview();
      navigate(path);
    }
  };

  return (
    <div className="app-shell">
      <div className="screen">{children}</div>

      <nav className="tab-bar">
        {TABS.map((tab) => {
          const active = activeBase === tab.path;
          return (
            <button
              key={tab.path}
              className={`tab-btn${active ? ' active' : ''}`}
              onClick={() => goTo(tab.path)}
            >
              <span className="tab-icon">{active ? tab.icon : tab.iconOff}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
