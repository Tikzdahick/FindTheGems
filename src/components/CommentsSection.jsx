import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { avatarColor } from '../data/mockData';

const MAX_CHARS   = 500;
const INITIAL_SHOW = 5;

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CommentItem({ comment }) {
  const bg      = avatarColor(comment.username);
  const initial = (comment.username || '?')[0].toUpperCase();
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: '#fff',
      }}>
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>@{comment.username}</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{timeAgo(comment.timestamp)}</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>
          {comment.text}
        </p>
      </div>
    </div>
  );
}

export default function CommentsSection({ postId }) {
  const { profile, getComments, addComment } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [text,     setText]     = useState('');
  const [showAll,  setShowAll]  = useState(false);

  const all      = getComments(postId);
  const display  = showAll ? all : all.slice(0, INITIAL_SHOW);
  const username = profile.username || 'anonymous';
  const remaining = MAX_CHARS - text.length;

  const handleSubmit = () => {
    if (!text.trim() || text.length > MAX_CHARS) return;
    addComment(postId, {
      id:        `c_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      username,
      text:      text.trim(),
      timestamp: Date.now(),
    });
    setText('');
    setExpanded(true);
    setShowAll(false);
  };

  return (
    <div style={{ marginTop: 6 }}>
      {/* Toggle button */}
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0',
        }}
      >
        <span>💬</span>
        <span>{all.length} comment{all.length !== 1 ? 's' : ''}</span>
        <span style={{ fontSize: 10 }}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={{ marginTop: 12 }}>
          {/* Input area */}
          <div style={{
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 12, marginBottom: 14,
          }}>
            <textarea
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder={`Comment as @${username}…`}
              style={{
                background: 'none', border: 'none', padding: 0, marginBottom: 8,
                minHeight: 60, resize: 'none', boxShadow: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: remaining < 50 ? 'var(--gold)' : 'var(--text-dim)',
              }}>
                {remaining}/{MAX_CHARS}
              </span>
              <button
                className="btn btn-purple"
                style={{ padding: '7px 16px', fontSize: 13 }}
                onClick={handleSubmit}
                disabled={!text.trim()}
              >
                Post
              </button>
            </div>
          </div>

          {/* Comment list */}
          {display.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', padding: '12px 0' }}>
              No comments yet — be the first!
            </p>
          ) : (
            display.map((c) => <CommentItem key={c.id} comment={c} />)
          )}

          {all.length > INITIAL_SHOW && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--purple-light)', fontSize: 13, fontWeight: 600, padding: '4px 0' }}
            >
              Load {all.length - INITIAL_SHOW} more comment{all.length - INITIAL_SHOW !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
