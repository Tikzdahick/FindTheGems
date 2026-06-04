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
  const [onboarded, setOnboarded]   = useState(() => load('ftg_onboarded', false));
  const [profile,   setProfile]     = useState(() => load('ftg_profile', { username: '', avatar: null, joinDate: null, selectedGenres: [], selectedMoods: [] }));
  const [savedSongs,       setSavedSongs]       = useState(() => load('ftg_savedSongs', []));
  const [followedArtists,  setFollowedArtists]  = useState(() => load('ftg_followedArtists', []));
  const [communityPosts,   setCommunityPosts]   = useState(initialCommunityPosts);
  const [streak,           setStreak]           = useState(calcStreak);
  const [discoverProgress, setDiscoverProgress] = useState(calcDiscoverProgress);

  useEffect(() => { store('ftg_savedSongs',      savedSongs);      }, [savedSongs]);
  useEffect(() => { store('ftg_followedArtists', followedArtists); }, [followedArtists]);
  useEffect(() => { store('ftg_discover_progress', discoverProgress); }, [discoverProgress]);

  // ── Onboarding ──────────────────────────────────────────────────────────────
  const completeOnboarding = (data) => {
    const p = { ...data, joinDate: new Date().toISOString() };
    setProfile(p);
    setOnboarded(true);
    store('ftg_profile', p);
    store('ftg_onboarded', true);
  };

  // ── Profile ─────────────────────────────────────────────────────────────────
  const updateProfile = (updates) => {
    setProfile((prev) => { const next = { ...prev, ...updates }; store('ftg_profile', next); return next; });
  };

  // ── Saved songs ──────────────────────────────────────────────────────────────
  const saveSong   = (song) => setSavedSongs((p) => p.find((s) => s.id === song.id) ? p : [song, ...p]);
  const removeSong = (id)   => setSavedSongs((p) => p.filter((s) => s.id !== id));
  const isSongSaved = (id)  => savedSongs.some((s) => s.id === id);

  // ── Followed artists ─────────────────────────────────────────────────────────
  const toggleFollow = (id) => setFollowedArtists((p) => p.includes(id) ? p.filter((x) => x !== id) : [id, ...p]);
  const isFollowing  = (id) => followedArtists.includes(id);

  // ── Community ────────────────────────────────────────────────────────────────
  const addPost  = (post) => setCommunityPosts((p) => [post, ...p]);
  const votePost = (postId, dir) => {
    setCommunityPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const wasUp = p.userVote === 'up', wasDown = p.userVote === 'down';
      if (dir === 'up')   return { ...p, upvotes:   wasUp   ? p.upvotes   - 1 : p.upvotes   + 1, downvotes: wasDown ? p.downvotes - 1 : p.downvotes, userVote: wasUp   ? null : 'up'   };
      return               { ...p, downvotes: wasDown ? p.downvotes - 1 : p.downvotes + 1, upvotes:   wasUp   ? p.upvotes   - 1 : p.upvotes,   userVote: wasDown ? null : 'down' };
    }));
  };

  // ── Discover progress ────────────────────────────────────────────────────────
  const incrementDiscover = () => {
    setDiscoverProgress((p) => {
      const today = new Date().toDateString();
      const base  = p.date === today ? p : { date: today, seen: 0 };
      return { ...base, seen: base.seen + 1 };
    });
  };

  return (
    <AppContext.Provider value={{
      onboarded, completeOnboarding,
      profile,   updateProfile,
      savedSongs, saveSong, removeSong, isSongSaved,
      followedArtists, toggleFollow, isFollowing,
      communityPosts, addPost, votePost,
      streak,
      discoverProgress, incrementDiscover,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
