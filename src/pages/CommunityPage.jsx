import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { avatarColor } from '../data/mockData';

function UserAvatar({ username, size = 'sm' }) {
  const bg      = avatarColor(username);
  const initial = username?.[0]?.toUpperCase() || '?';
  const sz      = size === 'sm' ? 32 : 44;
  return (
    <div className={`avatar avatar-${size}`} style={{ width: sz, height: sz, background: bg, flexShrink: 0 }}>
      {initial}
    </div>
  );
}

function TrendingCard({ post }) {
  const score = post.upvotes - post.downvotes;
  return (
    <div className="trending-card glass">
      <img src={post.coverArt} alt={post.songName} className="trending-card-img" />
      <div className="trending-card-overlay" />
      <div className="trending-card-info">
        <div className="trending-card-song">{post.songName}</div>
        <div className="trending-card-artist">{post.artist}</div>
        <div className="trending-score">◆ +{score}</div>
      </div>
    </div>
  );
}

function PostCard({ post, onVote }) {
  const score = post.upvotes - post.downvotes;
  return (
    <div className="glass glass-hover post-card">
      <div className="post-header">
        <img src={post.coverArt} alt={post.songName} className="post-cover" />
        <div className="post-meta">
          <div className="post-song">{post.songName}</div>
          <div className="post-artist">{post.artist}</div>
        </div>
      </div>

      <div className="post-submitter">
        <UserAvatar username={post.submitter} size="sm" />
        <span className="post-submitter-name">@{post.submitter}</span>
        <span className="post-time">{post.commentCount} comments</span>
      </div>

      <div className="gem-label-row">
        <span className="gem-dot">◆</span>
        <span className="gem-label">Why it's a gem</span>
      </div>
      <p className="post-reason">"{post.reason}"</p>

      <div className="post-divider" />
      <div className="post-actions">
        <button className={`vote-btn${post.userVote === 'up'   ? ' up-active'   : ''}`} onClick={() => onVote(post.id, 'up')}>▲ {post.upvotes}</button>
        <button className={`vote-btn${post.userVote === 'down' ? ' down-active' : ''}`} onClick={() => onVote(post.id, 'down')}>▼ {post.downvotes}</button>
        <div style={{ marginLeft: 'auto', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: 'var(--purple-light)' }}>
          +{score} gems
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const { communityPosts, addPost, votePost } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ songName: '', artist: '', reason: '' });

  const trending = [...communityPosts].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)).slice(0, 3);
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.songName.trim() || !form.artist.trim() || !form.reason.trim()) return;
    addPost({
      id: `p_${Date.now()}`,
      songName:     form.songName.trim(),
      artist:       form.artist.trim(),
      coverArt:     `https://picsum.photos/seed/community-${Date.now()}/400/400`,
      submitter:    'you',
      reason:       form.reason.trim(),
      upvotes: 0, downvotes: 0, userVote: null, commentCount: 0,
    });
    setForm({ songName: '', artist: '', reason: '' });
    setModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="page-header">
        <div className="page-title">Community<br /><span className="gradient-text">Gems</span></div>
        <div className="page-subtitle">Hidden finds shared by listeners like you</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Trending — only shown when there are posts to trend */}
        {trending.length > 0 && (
          <>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ padding: '0 20px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>🔥 Trending This Week</span>
              </div>
              <div className="trending-scroll">
                {trending.map((post) => <TrendingCard key={post.id} post={post} />)}
              </div>
            </div>
            <div className="divider" style={{ marginBottom: 16 }} />
          </>
        )}

        {/* All posts — or empty state */}
        <div style={{ padding: '0 20px 100px' }}>
          {communityPosts.length > 0 ? (
            <>
              <p className="section-label" style={{ marginBottom: 12 }}>All Gems</p>
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} onVote={votePost} />
              ))}
            </>
          ) : (
            <div className="empty-state" style={{ paddingTop: 48 }}>
              <span className="gem-pulse empty-icon" style={{ fontSize: 44 }}>◆</span>
              <div className="empty-title">No gems yet</div>
              <p className="empty-sub">
                Songs are being added soon —<br />check back shortly!
              </p>
              <div className="coming-soon-badge" style={{ marginTop: 8 }}>
                Be the first to submit one ↓
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="fab" onClick={() => setModalOpen(true)}>+</button>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title">Share a Hidden <span className="gradient-text">Gem</span></div>

            <form onSubmit={handleSubmit}>
              <label className="field-label">Song Name</label>
              <input className="input" style={{ marginBottom: 14 }} placeholder="Track title..." value={form.songName} onChange={set('songName')} />

              <label className="field-label">Artist</label>
              <input className="input" style={{ marginBottom: 14 }} placeholder="Artist name..." value={form.artist} onChange={set('artist')} />

              <label className="field-label">Why it's a gem</label>
              <textarea className="input" style={{ marginBottom: 20 }} placeholder="Tell us what makes this track special..." value={form.reason} onChange={set('reason')} />

              <button type="submit" className="btn btn-purple" style={{ width: '100%', marginBottom: 10 }}>◆ Submit Gem</button>
              <button type="button" className="btn btn-ghost"  style={{ width: '100%' }} onClick={() => setModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
