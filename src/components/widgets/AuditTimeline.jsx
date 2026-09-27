import { Icon } from '../Icons.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { fmtDateTime } from '../../utils/format.js';

export function AuditTimeline({ events }) {
  if (!events.length) return <EmptyState icon="audit" title="No audit events" />;
  return (
    <div className="timeline">
      {events.map(e => (
        <div className="tl-item" key={e.id}>
          <div className="tl-dot done"><Icon name="check" /></div>
          <div className="tl-head">
            <b>{e.action}</b>
            <span className="badge badge-neutral">{e.entity}</span>
          </div>
          <div className="tl-meta">{e.user} · {e.role} · {fmtDateTime(e.ts)}</div>
          <div className="small muted" style={{ marginTop: 3 }}>{e.details}</div>
        </div>
      ))}
    </div>
  );
}