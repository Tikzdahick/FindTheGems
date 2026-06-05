import { formatListeners } from '../data/mockData';

// Generates an 800×800 PNG share card on a <canvas>.
// Returns the canvas element (call .toDataURL() on it).
export async function generateShareCard(song, artist) {
  const W = 800, H = 800;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── Background ──────────────────────────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#12003a');
  bgGrad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Cover art (best-effort — CORS may block some sources) ──────────────────
  if (song.coverArt) {
    try {
      await new Promise((res, rej) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = 0.35;
          ctx.drawImage(img, 0, 0, W, H);
          ctx.restore();
          res();
        };
        img.onerror = rej;
        img.src = song.coverArt;
        setTimeout(rej, 4000); // timeout
      });
    } catch { /* skip if CORS blocked */ }
  }

  // ── Dark overlay so text is always readable ─────────────────────────────────
  const overlay = ctx.createLinearGradient(0, 0, 0, H);
  overlay.addColorStop(0,   'rgba(10,10,10,0.5)');
  overlay.addColorStop(0.4, 'rgba(10,10,10,0.55)');
  overlay.addColorStop(1,   'rgba(10,10,10,0.92)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // ── Purple accent bar at top ────────────────────────────────────────────────
  const accentGrad = ctx.createLinearGradient(0, 0, W, 0);
  accentGrad.addColorStop(0, '#7c3aed');
  accentGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(0, 0, W, 6);

  // Helper: draw text with optional gradient fill
  const text = (str, x, y, font, color, align = 'left', maxW) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    if (maxW) {
      // Wrap / truncate
      const words = String(str).split(' ');
      let line = ''; let lineY = y;
      for (const w of words) {
        const test = line + w + ' ';
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line.trim(), x, lineY);
          line = w + ' '; lineY += 64;
          if (lineY > y + 64) { ctx.fillText(line.trim() + '…', x, lineY); return lineY; }
        } else { line = test; }
      }
      ctx.fillText(line.trim(), x, lineY);
      return lineY;
    }
    ctx.fillText(String(str), x, y);
    return y;
  };

  // ── ◆ FindTheGems logo ──────────────────────────────────────────────────────
  ctx.font = 'bold 30px Inter, Arial, sans-serif';
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'left';
  ctx.fillText('◆', 50, 74);
  ctx.fillStyle = '#f8fafc';
  ctx.fillText(' FindTheGems', 68, 74);

  // ── Song title ───────────────────────────────────────────────────────────────
  const titleY = text(
    song.title,
    50, 540,
    'bold 62px Inter, Arial, sans-serif',
    '#f8fafc', 'left', 700
  );

  // ── Artist name ──────────────────────────────────────────────────────────────
  const artistName = artist?.name || song.artistName || '';
  text(artistName, 50, titleY + 56, '600 34px Inter, Arial, sans-serif', '#a78bfa', 'left');

  // ── Listener count ────────────────────────────────────────────────────────────
  const listeners = formatListeners(song.monthlyListeners || 0);
  text(`${listeners} monthly listeners`, 50, titleY + 104, '400 22px Inter, Arial, sans-serif', '#94a3b8', 'left');

  // ── Genre chip ────────────────────────────────────────────────────────────────
  if (song.genre) {
    const chipW = ctx.measureText(song.genre).width + 28;
    ctx.fillStyle = 'rgba(124,58,237,0.7)';
    roundRect(ctx, 50, titleY + 130, chipW, 32, 16);
    ctx.fill();
    text(song.genre, 64, titleY + 152, 'bold 14px Inter, Arial, sans-serif', '#fff', 'left');
  }

  // ── Tagline ───────────────────────────────────────────────────────────────────
  text('Found on findthegems.vercel.app', 50, 770, '400 18px Inter, Arial, sans-serif', 'rgba(255,255,255,0.3)', 'left');

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
