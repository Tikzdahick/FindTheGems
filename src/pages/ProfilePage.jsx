import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getArtistById, avatarColor, ALL_GENRES, ALL_MOODS } from '../data/mockData';

function UserAvatar({ profile, size = 80 }) {
  const bg      = avatarColor(profile.username || 'user');
  const initial = (profile.username?.[0] || '?').toUpperCase();
  if (profile.avatar) {
    return <img src={profile.avatar} alt="avatar" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.38, fontWeight: 900, color: '#fff' }}>
      {initial}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileRef  = useRef();
  const { profile, updateProfile, savedSongs, followedArtists, communityPosts } = useApp();

  const [editingUsername, setEditingUsername] = useState(false);
  const [editingGenres,   setEditingGenres]   = useState(false);
  const [tempUsername,    setTempUsername]    = useState(profile.username);
  const [tempGenres,      setTempGenres]      = useState(profile.selectedGenres || []);

  const joinDate  = profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  const gemCount  = communityPosts.filter((p) => p.submitter === 'you').length;
  const followed  = followedArtists.map((id) => getArtistById(id)).filter(Boolean);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 80 }}>
        {/* Hero */}
        <div className="profile-hero">
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current.click()}>
            <div className="profile-avatar-ring">
              <UserAvatar profile={profile} size={82} />
            </div>
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#0a0a0a', fontWeight: 800 }}>+</div>
          </div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleAvatarUpload} style={{ display: 'none' }} />

          <div>
            {editingUsername ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="input"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveUsername()}
                  maxLength={24}
                  style={{ textAlign: 'center', padding: '8px 14px', fontSize: 18, fontWeight: 700 }}
                  autoFocus
                />
                <button className="btn btn-purple" style={{ padding: '8px 14px', fontSize: 13 }} onClick={saveUsername}>Save</button>
              </div>
            ) : (
              <div className="profile-username" style={{ cursor: 'pointer' }} onClick={() => { setTempUsername(profile.username); setEditingUsername(true); }}>
                {profile.username || 'GemHunter'} <span style={{ fontSize: 14, color: 'var(--text-dim)', marginLeft: 4 }}>✏️</span>
              </div>
            )}
            <div className="profile-since">Member since {joinDate}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-num gradient-text">{savedSongs.length}</span>
            <span className="stat-label">Saved Songs</span>
          </div>
          <div className="stat-card">
            <span className="stat-num gradient-text">{followedArtists.length}</span>
            <span className="stat-label">Artists</span>
          </div>
          <div className="stat-card">
            <span className="stat-num gradient-text">{gemCount}</span>
            <span className="stat-label">Gems Shared</span>
          </div>
        </div>

        {/* Following */}
        {followed.length > 0 && (
          <div className="profile-section">
            <p className="section-label">Following</p>
            {followed.map((artist) => (
              <div
                key={artist.id}
                className="followed-artist-row"
                onClick={() => navigate('/artist', { state: { artist } })}
              >
                <img src={artist.photo} alt={artist.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--glass-border)' }} />
                <div>
                  <div className="followed-artist-name">{artist.name}</div>
                  <div className="followed-artist-genre">{artist.genres.join(' · ')}</div>
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
            {!editingGenres && (
              <button className="btn btn-ghost" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => { setTempGenres(profile.selectedGenres || []); setEditingGenres(true); }}>Edit</button>
            )}
          </div>

          {editingGenres ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {ALL_GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => toggleTempGenre(g.id)}
                    style={{
                      padding: '7px 13px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                      borderColor: tempGenres.includes(g.id) ? 'var(--purple)' : 'rgba(255,255,255,0.1)',
                      background: tempGenres.includes(g.id) ? 'rgba(124,58,237,0.2)' : 'var(--surface-2)',
                      color: tempGenres.includes(g.id) ? 'var(--purple-light)' : 'var(--text-muted)',
                      transition: 'all 0.15s',
                    }}
                  >
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
              {(profile.selectedGenres || []).length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No genres selected yet</p>
              ) : (
                (profile.selectedGenres || []).map((id) => {
                  const g = ALL_GENRES.find((x) => x.id === id);
                  return g ? <span key={id} className="chip chip-genre">{g.emoji} {g.label}</span> : null;
                })
              )}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="profile-section">
          <p className="section-label">Settings</p>

          <div className="settings-item" onClick={() => { setTempUsername(profile.username); setEditingUsername(true); window.scrollTo(0,0); }}>
            <div className="settings-item-left">
              <span className="settings-item-icon">✏️</span>
              <div>
                <div className="settings-item-label">Edit Username</div>
                <div className="settings-item-sub">{profile.username || 'Not set'}</div>
              </div>
            </div>
            <span className="settings-item-arrow">›</span>
          </div>

          <div className="settings-item" onClick={() => { setTempGenres(profile.selectedGenres || []); setEditingGenres(true); }}>
            <div className="settings-item-left">
              <span className="settings-item-icon">🎵</span>
              <div>
                <div className="settings-item-label">Genre Preferences</div>
                <div className="settings-item-sub">{(profile.selectedGenres || []).length} selected</div>
              </div>
            </div>
            <span className="settings-item-arrow">›</span>
          </div>

          <div
            className="settings-item"
            onClick={() => { if (window.confirm('Clear all saved songs and followed artists?')) { localStorage.clear(); window.location.reload(); } }}
            style={{ borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <div className="settings-item-left">
              <span className="settings-item-icon">🗑️</span>
              <div>
                <div className="settings-item-label" style={{ color: 'var(--danger)' }}>Clear All Data</div>
                <div className="settings-item-sub">Reset app to defaults</div>
              </div>
            </div>
            <span className="settings-item-arrow" style={{ color: 'var(--danger)' }}>›</span>
          </div>
        </div>
      </div>
    </div>
  );
}
