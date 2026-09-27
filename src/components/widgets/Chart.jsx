const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function Bars({ data, height = 180, color = 'var(--primary)' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100 / data.length;
  return (
    <svg className="chart" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ height }}>
      {[0,1,2,3].map(i => <line key={i} className="grid-line" x1="0" y1={(height/4)*i} x2="100" y2={(height/4)*i} vectorEffect="non-scaling-stroke" />)}
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 24);
        return <rect key={i} className="bar" x={i*w + w*0.18} y={height - 20 - h} width={w*0.64} height={h} rx="1.5" fill={d.color || color} vectorEffect="non-scaling-stroke"><title>{d.label}: {d.value}</title></rect>;
      })}
      {data.map((d, i) => <text key={i} className="axis-text" x={i*w + w/2} y={height - 6} textAnchor="middle" style={{ fontSize: 8 }}>{String(d.label).slice(0, 8)}</text>)}
    </svg>
  );
}

export function LineChart({ series, height = 200, labels = [] }) {
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals, 1);
  const pad = 8;
  const W = 100, H = height;
  const stepX = (W - pad*2) / Math.max(labels.length - 1, 1);
  const y = v => H - 24 - ((v - 0) / (max - 0)) * (H - 40);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }}>
      {[0,1,2,3].map(i => <line key={i} className="grid-line" x1="0" y1={10 + i*((H-30)/3)} x2={W} y2={10 + i*((H-30)/3)} vectorEffect="non-scaling-stroke" />)}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => `${pad + i*stepX},${y(v)}`).join(' ');
        const area = `${pad},${H-24} ${pts} ${pad + (s.data.length-1)*stepX},${H-24}`;
        return (
          <g key={si}>
            <polygon className="area" points={area} fill={s.color} />
            <polyline className="line" points={pts} stroke={s.color} vectorEffect="non-scaling-stroke" />
            {s.data.map((v, i) => <circle key={i} className="dot" cx={pad + i*stepX} cy={y(v)} r="2.4" fill={s.color} vectorEffect="non-scaling-stroke"><title>{s.name} {labels[i] || ''}: {v}</title></circle>)}
          </g>
        );
      })}
      {labels.map((l, i) => <text key={i} className="axis-text" x={pad + i*stepX} y={H-6} textAnchor="middle" style={{ fontSize: 7 }}>{l}</text>)}
    </svg>
  );
}

export function Donut({ segments, size = 160, thickness = 18 }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = size / 2;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((s, i) => {
        const start = acc / total * Math.PI * 2 - Math.PI/2;
        acc += s.value;
        const end = acc / total * Math.PI * 2 - Math.PI/2;
        const large = (end - start) > Math.PI ? 1 : 0;
        const x1 = c + r*Math.cos(start), y1 = c + r*Math.sin(start);
        const x2 = c + r*Math.cos(end), y2 = c + r*Math.sin(end);
        return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} fill="none" stroke={s.color} strokeWidth={thickness}><title>{s.label}: {s.value}</title></path>;
      })}
    </svg>
  );
}

export function ScoreBar({ label, value, color = 'var(--primary)', max = 100 }) {
  return (
    <div className="score-bar">
      <div className="sb-label">{label}</div>
      <div className="sb-track"><span style={{ width: `${(value/max)*100}%`, background: color }} /></div>
      <div className="sb-val">{value}</div>
    </div>
  );
}