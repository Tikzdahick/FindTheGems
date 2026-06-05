import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { avatarColor } from '../data/mockData';
import CommentsSection from '../components/CommentsSection';

// ── Sub-components ────────────────────────────────────────────────────────────

function UserAvatar({ username, photo, size = 'sm' }) {
  const bg      = avatarColor(username);
  const initial = (username || '?')[0].toUpperCase();
  const sz      = size === 'sm' ? 32 : 44;
  if (photo) return <img src={photo} alt={username} style={{ width: sz, height: sz, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  return (
    <div style={{ width: sz, height: sz, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size === 'sm' ? 12 : 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
      {initial}
    </div>
  );
}

function Leaderboard({ posts }) {
  const top5 = [...posts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);
  if (top5.length === 0) return null;

  return (
    <div style={{ padding: '0 20px 4px' }}>
      <p className="section-label">🏆 Gem Leaderboard</p>
      {top5.map((post, i) => (
        <div key={post.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px', marginBottom: 8, borderRadius: 14,
          background: i === 0 ? 'rgba(245,158,11,0.07)' : 'var(--glass)',
          border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.4)' : 'var(--glass-border)'}`,
          transition: 'all 0.2s',
        }}>
          {/* Rank badge */}
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: i === 0 ? 'var(--gold)' : 'var(--surface-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: i === 0 ? 15 : 12, fontWeight: 800,
            color: i === 0 ? '#0a0a0a' : 'var(--text-muted)',
          }}>
            {i === 0 ? '🔥' : `#${i + 1}`}
          </div>
          {/* Song / artist */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.songName}</div>
            <div style={{ fontSize: 12, color: 'var(--purple-light)', fontWeight: 600, marginTop: 1 }}>{post.artist}</div>
          </div>
          {/* Upvotes */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: i === 0 ? 'var(--gold)' : 'var(--text)' }}>▲ {post.upvotes}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PostCard({ post, onVote, username, userPhoto }) {
  const score = post.upvotes - post.downvotes;
  return (
    <div className="glass post-card" style={{ marginBottom: 12 }}>
      <div className="post-header">
        <img src={post.coverArt} alt={post.songName} className="post-cover"
          onError={(e) => { e.target.style.display = 'none'; }} />
        <div className="post-meta">
          <div className="post-song">{post.songName}</div>
          <div className="post-artist">{post.artist}</div>
        </div>
      </div>

      <div className="post-submitter">
        <UserAvatar username={post.submitter === 'you' ? username : post.submitter}
          photo={post.submitter === 'you' ? userPhoto : null} size="sm" />
        <span className="post-submitter-name">@{post.submitter === 'you' ? (username || 'you') : post.submitter}</span>
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

      {/* Comments section */}
      <div style={{ marginTop: 12 }}>
        <CommentsSection postId={post.id} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const { communityPosts, addPost, votePost, profile, user } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]           = useState({ songName: '', artist: '', reason: '' });
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const username  = profile.username || user?.name || 'anonymous';
  const userPhoto = profile.avatar   || user?.photo || null;

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
        {/* Leaderboard — visible when there are posts */}
        {communityPosts.length > 0 && (
          <>
            <Leaderboard posts={communityPosts} />
            <div className="divider" style={{ margin: '12px 0 16px' }} />
          </>
        )}

        {/* Feed */}
        <div style={{ padding: '0 20px 100px' }}>
          {communityPosts.length > 0 ? (
            <>
              <p className="section-label" style={{ marginBottom: 12 }}>All Gems</p>
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} onVote={votePost} username={username} userPhoto={userPhoto} />
              ))}
            </>
          ) : (
            <div className="empty-state" style={{ paddingTop: 48 }}>
              <span className="gem-pulse empty-icon" style={{ fontSize: 44 }}>◆</span>
              <div className="empty-title">No gems yet</div>
              <p className="empty-sub">Songs are being added soon —<br />check back shortly!</p>
              <div className="coming-soon-badge" style={{ marginTop: 8 }}>Be the first to submit one ↓</div>
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
              <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
