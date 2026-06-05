import { createContext, useContext, useState, useEffect } from 'react';
import { initialCommunityPosts } from '../data/mockData';

const AppContext = createContext();

const load  = (key, fb) => { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const store = (key, v)  => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

function calcStreak() {
  const raw = load('ftg_streak', null);
  const today = new Date().toDateString();
  if (!raw) return { count: 1, lastDate: today };
  if (raw.lastDate === today) return raw;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const count = raw.lastDate === yesterday ? raw.count + 1 : 1;
  const next = { count, lastDate: today };
  store('ftg_streak', next);
  return next;
}

function calcDiscoverProgress() {
  const today = new Date().toDateString();
  const raw = load('ftg_discover_progress', null);
  if (raw?.date === today) return raw;
  return { date: today, seen: 0 };
}

export function AppProvider({ children }) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => load('ftg_user', null));

  const login  = (u) => { setUser(u); store('ftg_user', u); };
  const logout = () => {
    setUser(null); store('ftg_user', null);
    setOnboarded(false); store('ftg_onboarded', false);
    // Sign out of Google if available
    try { window.google?.accounts?.id?.disableAutoSelect(); } catch {}
  };

  // ── Onboarding & profile ─────────────────────────────────────────────────────
  const [onboarded, setOnboarded] = useState(() => load('ftg_onboarded', false));
  const [profile,   setProfile]   = useState(() => load('ftg_profile', {
    username: '', avatar: null, joinDate: null, selectedGenres: [], selectedMoods: [],
  }));

  const completeOnboarding = async (data) => {
    const p = { ...data, joinDate: new Date().toISOString() };
    setProfile(p); setOnboarded(true);
    store('ftg_profile', p); store('ftg_onboarded', true);

    // Request notification permission after onboarding
    if ('Notification' in window && Notification.permission === 'default') {
      try { await Notification.requestPermission(); } catch {}
    }
  };

  const updateProfile = (updates) => {
    setProfile((prev) => { const next = { ...prev, ...updates }; store('ftg_profile', next); return next; });
  };

  // ── Notifications ─────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(() => load('ftg_notifications', []));

  useEffect(() => { store('ftg_notifications', notifications); }, [notifications]);

  const addNotification = (n) => setNotifications((p) => [n, ...p].slice(0, 50));
  const markAllRead     = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));
  const clearNotifs     = () => setNotifications([]);
  const unreadCount     = notifications.filter((n) => !n.read).length;

  const fireNotification = (title, body, songTitle) => {
    const n = { id: `n_${Date.now()}`, title, body, songTitle, timestamp: Date.now(), read: false };
    addNotification(n);
    if (Notification.permission === 'granted') {
      try { new Notification(title, { body, icon: '/favicon.svg' }); } catch {}
    }
  };

  // ── Saved songs ───────────────────────────────────────────────────────────────
  const [savedSongs, setSavedSongs] = useState(() => load('ftg_savedSongs', []));
  useEffect(() => { store('ftg_savedSongs', savedSongs); }, [savedSongs]);
  const saveSong    = (song) => setSavedSongs((p) => p.find((s) => s.id === song.id) ? p : [song, ...p]);
  const removeSong  = (id)   => setSavedSongs((p) => p.filter((s) => s.id !== id));
  const isSongSaved = (id)   => savedSongs.some((s) => s.id === id);

  // ── Followed artists ──────────────────────────────────────────────────────────
  const [followedArtists, setFollowedArtists] = useState(() => load('ftg_followedArtists', []));
  useEffect(() => { store('ftg_followedArtists', followedArtists); }, [followedArtists]);
  const toggleFollow = (id) => setFollowedArtists((p) => p.includes(id) ? p.filter((x) => x !== id) : [id, ...p]);
  const isFollowing  = (id) => followedArtists.includes(id);

  // ── Community posts ───────────────────────────────────────────────────────────
  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);
  const addPost  = (post) => setCommunityPosts((p) => [post, ...p]);
  const votePost = (postId, dir) => {
    setCommunityPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const wasUp = p.userVote === 'up', wasDown = p.userVote === 'down';
      if (dir === 'up')
        return { ...p, upvotes: wasUp ? p.upvotes - 1 : p.upvotes + 1, downvotes: wasDown ? p.downvotes - 1 : p.downvotes, userVote: wasUp ? null : 'up' };
      return { ...p, downvotes: wasDown ? p.downvotes - 1 : p.downvotes + 1, upvotes: wasUp ? p.upvotes - 1 : p.upvotes, userVote: wasDown ? null : 'down' };
    }));
  };

  // ── Comments ──────────────────────────────────────────────────────────────────
  // Shape: { [postId]: [{ id, username, text, timestamp }] }
  const [comments, setComments] = useState(() => load('ftg_comments', {}));
  useEffect(() => { store('ftg_comments', comments); }, [comments]);

  const addComment = (postId, comment) => {
    setComments((prev) => ({ ...prev, [postId]: [comment, ...(prev[postId] || [])] }));
    setCommunityPosts((prev) => prev.map((p) =>
      p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
    ));
  };
  const getComments = (postId) => comments[postId] || [];

  // ── Discover progress & streak ────────────────────────────────────────────────
  const [streak,           setStreak]           = useState(calcStreak);
  const [discoverProgress, setDiscoverProgress] = useState(calcDiscoverProgress);
  useEffect(() => { store('ftg_discover_progress', discoverProgress); }, [discoverProgress]);

  const incrementDiscover = () => {
    setDiscoverProgress((p) => {
      const today = new Date().toDateString();
      const base  = p.date === today ? p : { date: today, seen: 0 };
      return { ...base, seen: base.seen + 1 };
    });
  };

  return (
    <AppContext.Provider value={{
      // auth
      user, login, logout,
      // profile & onboarding
      onboarded, completeOnboarding, profile, updateProfile,
      // notifications
      notifications, addNotification, markAllRead, clearNotifs, unreadCount, fireNotification,
      // saved
      savedSongs, saveSong, removeSong, isSongSaved,
      // follows
      followedArtists, toggleFollow, isFollowing,
      // community
      communityPosts, addPost, votePost,
      // comments
      comments, addComment, getComments,
      // discover
      streak, discoverProgress, incrementDiscover,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
