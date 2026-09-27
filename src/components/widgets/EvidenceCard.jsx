import { Icon } from '../Icons.jsx';
import { Badge } from '../ui/Badge.jsx';
import { timeAgo } from '../../utils/format.js';

export function EvidenceCard({ evidence, onClick }) {
  return (
    <div className="board-card" style={{ cursor: 'pointer' }} onClick={() => onClick?.(evidence)}>
      <div className="bc-id">{evidence.id}</div>
      <div className="bc-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="file" />{evidence.name}
      </div>
      <div className="bc-meta">
        <span><Icon name="folder" />{evidence.type}</span>
        <span><Icon name="clock" />{timeAgo(evidence.uploadedAt)}</span>
      </div>
      <div className="bc-foot">
        <span className="xsmall muted">{evidence.uploadedBy}</span>
        <Badge status={evidence.status} />
      </div>
    </div>
  );
}