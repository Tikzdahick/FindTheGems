import { createContext, useContext, useState, useEffect } from 'react';
import { initialCommunityPosts } from '../data/mockData';

const AppContext = createContext();

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export function AppProvider({ children }) {
  const [savedSongs, setSavedSongs] = useState(() => load('ftg_savedSongs', []));
  const [followedArtists, setFollowedArtists] = useState(() => load('ftg_followedArtists', []));
  const [communityPosts, setCommunityPosts] = useState(initialCommunityPosts);

  useEffect(() => { save('ftg_savedSongs', savedSongs); }, [savedSongs]);
  useEffect(() => { save('ftg_followedArtists', followedArtists); }, [followedArtists]);

  const saveSong = (song) => {
    setSavedSongs((prev) => {
      if (prev.find((s) => s.id === song.id)) return prev;
      return [song, ...prev];
    });
  };

  const removeSong = (songId) =>
    setSavedSongs((prev) => prev.filter((s) => s.id !== songId));

  const isSongSaved = (songId) => savedSongs.some((s) => s.id === songId);

  const toggleFollow = (artistId) =>
    setFollowedArtists((prev) =>
      prev.includes(artistId) ? prev.filter((id) => id !== artistId) : [artistId, ...prev]
    );

  const isFollowing = (artistId) => followedArtists.includes(artistId);

  const addPost = (post) => setCommunityPosts((prev) => [post, ...prev]);

  const votePost = (postId, dir) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const wasUp = p.userVote === 'up';
        const wasDown = p.userVote === 'down';
        if (dir === 'up') {
          return { ...p, upvotes: wasUp ? p.upvotes - 1 : p.upvotes + 1, downvotes: wasDown ? p.downvotes - 1 : p.downvotes, userVote: wasUp ? null : 'up' };
        }
        return { ...p, downvotes: wasDown ? p.downvotes - 1 : p.downvotes + 1, upvotes: wasUp ? p.upvotes - 1 : p.upvotes, userVote: wasDown ? null : 'down' };
      })
    );
  };

  return (
    <AppContext.Provider value={{ savedSongs, saveSong, removeSong, isSongSaved, followedArtists, toggleFollow, isFollowing, communityPosts, addPost, votePost }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
