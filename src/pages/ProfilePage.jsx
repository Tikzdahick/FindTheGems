import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getArtistById, ALL_GENRES, ALL_MOODS, avatarColor } from '../data/mockData';

function UserAvatar({ profile, user, size = 80 }) {
  const src  = profile.avatar || user?.photo;
  const name = profile.username || user?.name || 'G';
  const bg   = avatarColor(name);
  if (src) return <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 900, color: '#fff' }}>
      {name[0].toUpperCase()}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileRef  = useRef();
  const {
    profile, updateProfile, user, logout,
    savedSongs, followedArtists, communityPosts,
    fireNotification, notifications,
  } = useApp();

  const [editingUsername, setEditingUsername] = useState(false);
  const [editingGenres,   setEditingGenres]   = useState(false);
  const [tempUsername,    setTempUsername]    = useState(profile.username);
  const [tempGenres,      setTempGenres]      = useState(profile.selectedGenres || []);
  const [simulating,      setSimulating]      = useState(false);

  const joinDate  = profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const gemCount  = communityPosts.filter((p) => p.submitter === 'you').length;
  const followed  = followedArtists.map((id) => getArtistById(id)).filter(Boolean);
  const displayName = profile.username || user?.name || 'GemHunter';

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateProfile({ avatar: ev.target.result });
    reader.readAsDataURL(file);
  };

  const saveUsername = () => {
    if (tempUsername.trim()) updateProfile({ username: tempUsername.trim() });
    setEditingUsername(false);
  };

  const saveGenres = () => {
    updateProfile({ selectedGenres: tempGenres });
    setEditingGenres(false);
  };

  const toggleTempGenre = (id) => setTempGenres((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const simulateGemBlowup = async () => {
    setSimulating(true);
    const gem    = savedSongs[0];
    const artist = gem ? (getArtistById(gem.artistId) || { name: gem.artistName || 'Unknown' }) : null;

    if (!gem) {
      alert('Save a song first from the Discover tab!');
      setSimulating(false);
      return;
    }

    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    fireNotification(
      '🔥 Gem Alert!',
      `"${gem.title}" by ${artist?.name} just crossed 1M listeners — you found it early!`,
      gem.title,
    );

    setTimeout(() => setSimulating(false), 1500);
  };

  const notifPermission = 'Notification' in window ? Notification.permission : 'unsupported';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>

        {/* Hero */}
        <div className="profile-hero">
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current.click()}>
            <div className="profile-avatar-ring">
              <UserAvatar profile={profile} user={user} size={82} />
            </div>
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#0a0a0a', fontWeight: 800 }}>+</div>
          </div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleAvatarUpload} style={{ display: 'none' }} />

          <div>
            {editingUsername ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input className="input" value={tempUsername} onChange={(e) => setTempUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveUsername()} maxLength={24}
                  style={{ textAlign: 'center', padding: '8px 14px', fontSize: 18, fontWeight: 700 }} autoFocus />
                <button className="btn btn-purple" style={{ padding: '8px 14px', fontSize: 13 }} onClick={saveUsername}>Save</button>
              </div>
            ) : (
              <div className="profile-username" style={{ cursor: 'pointer' }} onClick={() => { setTempUsername(profile.username); setEditingUsername(true); }}>
                {displayName} <span style={{ fontSize: 14, color: 'var(--text-dim)', marginLeft: 4 }}>✏️</span>
              </div>
            )}
            {user?.email && <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>{user.email}</div>}
            <div className="profile-since">Member since {joinDate}</div>
            {user?.provider === 'google' && (
              <div style={{ marginTop: 6, fontSize: 11, background: 'rgba(66,133,244,0.12)', border: '1px solid rgba(66,133,244,0.25)', borderRadius: 999, padding: '3px 10px', color: '#7ab4f5', display: 'inline-block' }}>
                🔵 Google account
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card"><span className="stat-num gradient-text">{savedSongs.length}</span><span className="stat-label">Saved Songs</span></div>
          <div className="stat-card"><span className="stat-num gradient-text">{followedArtists.length}</span><span className="stat-label">Artists</span></div>
          <div className="stat-card"><span className="stat-num gradient-text">{gemCount}</span><span className="stat-label">Gems Shared</span></div>
        </div>

        {/* Following */}
        {followed.length > 0 && (
          <div className="profile-section">
            <p className="section-label">Following</p>
            {followed.map((artist) => (
              <div key={artist.id} className="followed-artist-row" onClick={() => navigate('/artist', { state: { artist } })}>
                <img src={artist.photo} alt={artist.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }} />
                <div>
                  <div className="followed-artist-name">{artist.name}</div>
                  <div className="followed-artist-genre">{artist.genres?.join(' · ')}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>
        )}

        {/* Genre preferences */}
        <div className="profile-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <p className="section-label" style={{ marginBottom: 0 }}>Genre Preferences</p>
            {!editingGenres && <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => { setTempGenres(profile.selectedGenres || []); setEditingGenres(true); }}>Edit</button>}
          </div>
          {editingGenres ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {ALL_GENRES.map((g) => (
                  <button key={g.id} onClick={() => toggleTempGenre(g.id)} style={{
                    padding: '7px 13px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                    borderColor: tempGenres.includes(g.id) ? 'var(--purple)' : 'rgba(255,255,255,0.1)',
                    background: tempGenres.includes(g.id) ? 'rgba(124,58,237,0.2)' : 'var(--surface-2)',
                    color: tempGenres.includes(g.id) ? 'var(--purple-light)' : 'var(--text-muted)', transition: 'all 0.15s',
                  }}>
                    {g.emoji} {g.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-purple" style={{ flex: 2 }} onClick={saveGenres}>Save Preferences</button>
                <button className="btn btn-ghost"  style={{ flex: 1 }} onClick={() => setEditingGenres(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(profile.selectedGenres || []).length === 0
                ? <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No genres selected yet</p>
                : (profile.selectedGenres || []).map((id) => {
                    const g = ALL_GENRES.find((x) => x.id === id);
                    return g ? <span key={id} className="chip chip-genre">{g.emoji} {g.label}</span> : null;
                  })
              }
            </div>
          )}
        </div>

        {/* Notifications section */}
        <div className="profile-section">
          <p className="section-label">Notifications</p>

          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 14, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Browser Notifications</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                  {notifPermission === 'granted'  ? '✅ Enabled' :
                   notifPermission === 'denied'   ? '❌ Blocked in browser settings' :
                   notifPermission === 'default'  ? 'Not yet requested' : 'Not supported'}
                </div>
              </div>
              {notifPermission === 'default' && (
                <button className="btn btn-purple" style={{ padding: '7px 14px', fontSize: 13 }}
                  onClick={() => Notification.requestPermission()}>Enable</button>
              )}
            </div>
          </div>

          {/* Simulate notification */}
          <button
            className="btn btn-ghost"
            style={{ width: '100%', gap: 8, borderColor: 'rgba(245,158,11,0.3)', color: 'var(--gold-light)' }}
            onClick={simulateGemBlowup}
            disabled={simulating}
          >
            {simulating ? '🔥 Sending notification…' : '🔥 Simulate Gem Blowing Up'}
          </button>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', marginTop: 6 }}>
            Triggers a test notification for your first saved song
          </p>
        </div>

        {/* Settings */}
        <div className="profile-section">
          <p className="section-label">Settings</p>

          <div className="settings-item" onClick={() => { setTempUsername(profile.username); setEditingUsername(true); window.scrollTo(0, 0); }}>
            <div className="settings-item-left"><span className="settings-item-icon">✏️</span>
              <div><div className="settings-item-label">Edit Username</div><div className="settings-item-sub">{displayName}</div></div>
            </div>
            <span className="settings-item-arrow">›</span>
          </div>

          <div className="settings-item" onClick={() => { setTempGenres(profile.selectedGenres || []); setEditingGenres(true); }}>
            <div className="settings-item-left"><span className="settings-item-icon">🎵</span>
              <div><div className="settings-item-label">Genre Preferences</div><div className="settings-item-sub">{(profile.selectedGenres || []).length} selected</div></div>
            </div>
            <span className="settings-item-arrow">›</span>
          </div>

          {/* Sign out */}
          <div className="settings-item" style={{ borderColor: 'rgba(167,139,250,0.2)' }}
            onClick={() => { if (window.confirm('Sign out of FindTheGems?')) logout(); }}>
            <div className="settings-item-left"><span className="settings-item-icon">🚪</span>
              <div><div className="settings-item-label" style={{ color: 'var(--purple-light)' }}>Sign Out</div><div className="settings-item-sub">{user?.provider === 'google' ? 'Signed in with Google' : 'Guest session'}</div></div>
            </div>
            <span className="settings-item-arrow" style={{ color: 'var(--purple-light)' }}>›</span>
          </div>

          <div className="settings-item" style={{ borderColor: 'rgba(239,68,68,0.2)' }}
            onClick={() => { if (window.confirm('Clear all saved songs and followed artists?')) { localStorage.clear(); window.location.reload(); } }}>
            <div className="settings-item-left"><span className="settings-item-icon">🗑️</span>
              <div><div className="settings-item-label" style={{ color: 'var(--danger)' }}>Clear All Data</div><div className="settings-item-sub">Reset app to defaults</div></div>
            </div>
            <span className="settings-item-arrow" style={{ color: 'var(--danger)' }}>›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
