import { STAGES } from '../../data/seed.js';

export function Pipeline({ challenges, activeStage, onSelect }) {
  const counts = {};
  STAGES.forEach(s => counts[s.key] = 0);
  challenges.forEach(c => { if (counts[c.stage] != null) counts[c.stage]++; });

  return (
    <div className="pipeline-wrap">
      <div className="pipeline">
        {STAGES.map(s => (
          <div
            key={s.key}
            className={`pipe-stage ${activeStage === s.key ? 'active' : ''}`}
            onClick={() => onSelect?.(s.key)}
          >
            <div className="pipe-num">
              <span>STAGE {s.num}</span>
              {counts[s.key] > 0 && <span style={{ color: 'var(--text-3)' }}>{counts[s.key]}</span>}
            </div>
            <div className="pipe-name">{s.name}</div>
            <div className="pipe-count">{counts[s.key]}</div>
            <div className="pipe-bar">
              <span style={{ width: counts[s.key] ? `${Math.min(100, counts[s.key] * 12 + 8)}%` : 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}