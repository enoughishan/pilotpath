import { Link } from 'react-router-dom';
import { Icon } from '../Icons.jsx';

export function ChallengeCard({ challenge }) {
  const c = challenge;
  return (
    <Link to={`/challenges/${c.id}`} className={`board-card pri-${c.priority}`}>
      <div className="bc-id">{c.id}</div>
      <div className="bc-title">{c.title}</div>
      <div className="bc-meta">
        <span><Icon name="mapPin" />{c.district}</span>
        <span><Icon name="building" />{c.dept}</span>
      </div>
      <div className="bc-foot">
        <span className="xsmall muted">Day {c.day}</span>
        {c.status === 'Needs action'
          ? <span className="badge badge-danger">Needs action</span>
          : <span className="badge badge-neutral">{c.status}</span>}
      </div>
    </Link>
  );
}