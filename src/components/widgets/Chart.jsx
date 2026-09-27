/* ============================================================
   CHART COMPONENTS — UDBHAV
   ============================================================ */

/**
 * Bars — vertical bar chart. Use ONLY for short labels (≤6 chars).
 * For anything longer, use HBars.
 */
export function Bars({
  data,
  height = 220,
  color = 'var(--primary)',
  showValues = true
}) {
  if (!data || !data.length) {
    return (
      <div style={{ height, display: 'grid', placeItems: 'center', color: 'var(--text-4)', fontSize: 12 }}>
        No data
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.value), 1);
  const count = data.length;
  const colWidth = 100 / count;
  const barWidth = colWidth * 0.55;
  const padding = colWidth * 0.225;
  const topPad = 28;
  const bottomPad = 32;
  const chartH = height - topPad - bottomPad;

  return (
    <svg
      className="chart"
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      style={{ height, width: '100%', display: 'block' }}
    >
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = topPad + chartH * p;
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray={i === 4 ? '0' : '2 2'}
            vectorEffect="non-scaling-stroke"
            opacity={i === 4 ? 1 : 0.5}
          />
        );
      })}

      {data.map((d, i) => {
        const barHeight = (d.value / max) * chartH;
        const x = i * colWidth + padding;
        const y = topPad + chartH - barHeight;
        return (
          <g key={i}>
            <rect
              className="bar"
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="2"
              fill={d.color || color}
              vectorEffect="non-scaling-stroke"
            >
              <title>{d.label}: {d.value}</title>
            </rect>
            {showValues && d.value > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  fill: 'var(--navy)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.02em'
                }}
              >
                {d.value}
              </text>
            )}
          </g>
        );
      })}

      {data.map((d, i) => {
        const x = i * colWidth + colWidth / 2;
        return (
          <text
            key={i}
            x={x}
            y={height - 8}
            textAnchor="middle"
            style={{
              fontSize: 9,
              fill: 'var(--text-3)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600
            }}
          >
            {String(d.label).slice(0, 6)}
          </text>
        );
      })}
    </svg>
  );
}

/**
 * HBars — horizontal bar chart. Best for long labels.
 * Renders as HTML for full-text clarity.
 */
export function HBars({
  data,
  color = 'var(--primary)',
  labelWidth = 140,
  showValues = true,
  barHeight = 10,
  gap = 14
}) {
  if (!data || !data.length) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-4)', fontSize: 12 }}>
        No data
      </div>
    );
  }

  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: `${labelWidth}px 1fr auto`,
              gap: 14,
              alignItems: 'center'
            }}
            title={`${d.label}: ${d.value}`}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--text-2)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {d.label}
            </div>
            <div
              style={{
                height: barHeight,
                background: 'var(--surface-3)',
                borderRadius: barHeight / 2,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: d.color || color,
                  borderRadius: barHeight / 2,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
            {showValues && (
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'var(--navy)',
                  textAlign: 'right',
                  letterSpacing: '-0.01em',
                  minWidth: 24
                }}
              >
                {d.value}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * StagePipeline — horizontal flow chart for the 10-stage pipeline.
 * Shows every stage as a row with: number, name, count bar, count.
 * Handles long stage names cleanly.
 */
export function StagePipeline({ stages, values, color = 'var(--primary)' }) {
  if (!stages || !stages.length) return null;
  const max = Math.max(...Object.values(values), 1);
  const total = Object.values(values).reduce((a, b) => a + b, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '28px 130px 1fr 40px',
          gap: 12,
          alignItems: 'center',
          paddingBottom: 8,
          borderBottom: '1px solid var(--border)',
          marginBottom: 4
        }}
      >
        <div />
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          Stage
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          Distribution
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--text-4)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            textAlign: 'right'
          }}
        >
          Count
        </div>
      </div>

      {/* Rows */}
      {stages.map((s, i) => {
        const count = values[s.key] || 0;
        const pct = (count / max) * 100;
        const sharePct = total ? Math.round((count / total) * 100) : 0;
        const isZero = count === 0;

        return (
          <div
            key={s.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '28px 130px 1fr 40px',
              gap: 12,
              alignItems: 'center',
              padding: '6px 0'
            }}
            title={`${s.name}: ${count} challenge${count === 1 ? '' : 's'}`}
          >
            {/* Stage number badge */}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: isZero ? 'var(--surface-2)' : 'var(--primary-50)',
                color: isZero ? 'var(--text-4)' : 'var(--primary)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 11,
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                flexShrink: 0
              }}
            >
              {s.num}
            </div>

            {/* Stage name */}
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 650,
                color: isZero ? 'var(--text-4)' : 'var(--navy)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {s.name}
            </div>

            {/* Bar */}
            <div
              style={{
                height: 8,
                background: 'var(--surface-3)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: isZero ? 'transparent' : color,
                  borderRadius: 4,
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>

            {/* Count + share */}
            <div
              style={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 2
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  fontWeight: 800,
                  color: isZero ? 'var(--text-4)' : 'var(--navy)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1
                }}
              >
                {count}
              </div>
              {!isZero && (
                <div style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 600 }}>
                  {sharePct}%
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * LineChart — multi-series line chart.
 */
export function LineChart({ series, height = 200, labels = [] }) {
  if (!series || !series.length || !series[0].data.length) {
    return (
      <div style={{ height, display: 'grid', placeItems: 'center', color: 'var(--text-4)', fontSize: 12 }}>
        No data
      </div>
    );
  }

  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals, 1);
  const pad = 6;
  const W = 100;
  const H = height;
  const stepX = (W - pad * 2) / Math.max(labels.length - 1, 1);
  const y = v => H - 26 - (v / max) * (H - 42);

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height, width: '100%' }}>
      {[0, 1, 2, 3].map(i => (
        <line
          key={i}
          className="grid-line"
          x1="0"
          y1={10 + i * ((H - 40) / 3)}
          x2={W}
          y2={10 + i * ((H - 40) / 3)}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
          opacity="0.6"
        />
      ))}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => `${pad + i * stepX},${y(v)}`).join(' ');
        const area = `${pad},${H - 26} ${pts} ${pad + (s.data.length - 1) * stepX},${H - 26}`;
        return (
          <g key={si}>
            <polygon points={area} fill={s.color} opacity="0.12" />
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {s.data.map((v, i) => (
              <circle key={i} cx={pad + i * stepX} cy={y(v)} r="2.6" fill={s.color} stroke="var(--surface)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
                <title>{s.name} {labels[i] || ''}: {v}</title>
              </circle>
            ))}
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={i} x={pad + i * stepX} y={H - 8} textAnchor="middle" style={{ fontSize: 8, fill: 'var(--text-3)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          {l}
        </text>
      ))}
    </svg>
  );
}

/**
 * Donut — segmented donut chart.
 */
export function Donut({ segments, size = 180, thickness = 22 }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  let acc = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += s.value;
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const large = end - start > Math.PI ? 1 : 0;
        const x1 = c + r * Math.cos(start);
        const y1 = c + r * Math.sin(start);
        const x2 = c + r * Math.cos(end);
        const y2 = c + r * Math.sin(end);
        return (
          <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={s.color} strokeWidth={thickness} strokeLinecap="butt">
            <title>{s.label}: {s.value}</title>
          </path>
        );
      })}
      <text x={c} y={c + 8} textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: 'var(--navy)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
        {total}
      </text>
    </svg>
  );
}

/**
 * ScoreBar — inline score progress bar.
 */
export function ScoreBar({ label, value, color = 'var(--primary)', max = 100 }) {
  return (
    <div className="score-bar">
      <div className="sb-label">{label}</div>
      <div className="sb-track">
        <span style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <div className="sb-val">{value}</div>
    </div>
  );
}