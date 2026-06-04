// Dual-handle range slider with a logarithmic listener-count scale.
// Internal slider positions are 0-100; we map them to listener counts via log10.

export const SLIDER_MAX = 10_000_000;

// Slider position (0–100) → listener count
export function sliderToCount(v) {
  if (v <= 0)   return 0;
  if (v >= 100) return SLIDER_MAX;
  // log10 scale: position 100 → 10^7 = 10M
  return Math.round(Math.pow(10, (v / 100) * 7));
}

// Listener count → slider position (0–100)
export function countToSlider(n) {
  if (n <= 0)          return 0;
  if (n >= SLIDER_MAX) return 100;
  return Math.round((Math.log10(Math.max(n, 1)) / 7) * 100);
}

export function fmtCount(n) {
  if (n >= SLIDER_MAX)   return '10M+';
  if (n >= 1_000_000)    return `${(n / 1_000_000).toFixed(n % 1_000_000 < 50_000 ? 0 : 1)}M`;
  if (n >= 1_000)        return `${Math.round(n / 1_000)}K`;
  return n === 0 ? '0' : String(n);
}

export function rangeLabel(minV, maxV) {
  return `${fmtCount(sliderToCount(minV))} — ${sliderToCount(maxV) >= SLIDER_MAX ? '10M+' : fmtCount(sliderToCount(maxV))}`;
}

export default function RangeSlider({ minV, maxV, onChange }) {
  const minPct = minV;      // already 0-100
  const maxPct = maxV;

  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), maxV - 1);
    onChange(v, maxV);
  };
  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), minV + 1);
    onChange(minV, v);
  };

  // Tick marks at meaningful listener thresholds
  const TICKS = [
    { label: '0',    pct: 0 },
    { label: '1K',   pct: countToSlider(1_000) },
    { label: '100K', pct: countToSlider(100_000) },
    { label: '1M',   pct: countToSlider(1_000_000) },
    { label: '10M+', pct: 100 },
  ];

  return (
    <div style={{ padding: '4px 20px 20px' }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)' }}>
          Listeners
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--purple-light)', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 999, padding: '3px 10px' }}>
          {rangeLabel(minV, maxV)}
        </span>
      </div>

      {/* Slider track + thumbs */}
      <div style={{ position: 'relative', height: 36, display: 'flex', alignItems: 'center' }}>
        {/* Track background */}
        <div style={{ position: 'absolute', width: '100%', height: 4, background: 'var(--surface-3)', borderRadius: 2 }}>
          {/* Active range fill */}
          <div style={{
            position: 'absolute',
            height: '100%',
            left:  `${minPct}%`,
            right: `${100 - maxPct}%`,
            background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
            borderRadius: 2,
          }} />
        </div>

        {/* Min thumb — higher z-index when pushed to the far right to stay reachable */}
        <input
          type="range" min={0} max={100} step={1}
          value={minV}
          onChange={handleMin}
          className="range-thumb"
          style={{ zIndex: minV > 95 ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range" min={0} max={100} step={1}
          value={maxV}
          onChange={handleMax}
          className="range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* Tick marks */}
      <div style={{ position: 'relative', height: 18, marginTop: 4 }}>
        {TICKS.map(({ label, pct }) => (
          <span
            key={label}
            style={{
              position: 'absolute',
              left: `${pct}%`,
              transform: pct === 0 ? 'none' : pct === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
              fontSize: 10,
              color: 'var(--text-dim)',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
