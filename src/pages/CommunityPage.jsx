import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CommunityPage() {
  const { communityPosts, addPost, votePost } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ songName: '', artist: '', reason: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.songName.trim() || !form.artist.trim() || !form.reason.trim()) return;
    addPost({
      id: `p_${Date.now()}`,
      songName: form.songName.trim(),
      artist: form.artist.trim(),
      submitter: 'you',
      reason: form.reason.trim(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
    });
    setForm({ songName: '', artist: '', reason: '' });
    setModalOpen(false);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div className="page-header">
        <div className="page-title">Community Gems</div>
        <div className="page-subtitle">Hidden finds shared by the community</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px' }}>
        {communityPosts.map((post) => (
          <div key={post.id} className="card post-card">
            <div className="post-header">
              <div>
                <div className="post-song">{post.songName}</div>
                <div className="post-artist">{post.artist}</div>
              </div>
              <div className="submitter-badge">@{post.submitter}</div>
            </div>
            <div className="gem-label">
              <span className="gem-label-icon">◆</span>
              <span className="gem-label-text">Why it's a gem</span>
            </div>
            <p className="post-reason">"{post.reason}"</p>
            <div className="vote-row">
              <button
                className={`vote-btn${post.userVote === 'up' ? ' up-active' : ''}`}
                onClick={() => votePost(post.id, 'up')}
              >
                ▲ {post.upvotes}
              </button>
              <button
                className={`vote-btn${post.userVote === 'down' ? ' down-active' : ''}`}
                onClick={() => votePost(post.id, 'down')}
              >
                ▼ {post.downvotes}
              </button>
              <div className="score-chip">+{post.upvotes - post.downvotes} gems</div>
            </div>
          </div>
        ))}
      </div>

      <button className="fab" onClick={() => setModalOpen(true)}>+</button>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Share a Hidden Gem</div>
            <form onSubmit={handleSubmit}>
              <div className="field-label">Song Name</div>
              <input className="input" style={{ marginBottom: 14 }} placeholder="Track title..." value={form.songName} onChange={set('songName')} />

              <div className="field-label">Artist</div>
              <input className="input" style={{ marginBottom: 14 }} placeholder="Artist name..." value={form.artist} onChange={set('artist')} />

              <div className="field-label">Why it's a gem</div>
              <textarea
                className="input"
                style={{ marginBottom: 20 }}
                placeholder="Tell us why this track deserves more ears..."
                value={form.reason}
                onChange={set('reason')}
              />

              <button type="submit" className="btn btn-purple" style={{ width: '100%', marginBottom: 10 }}>
                ◆ Submit Gem
              </button>
              <button type="button" className="btn" style={{ width: '100%', background: 'none', color: 'var(--text-muted)' }} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
