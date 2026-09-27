import { Icon } from '../Icons.jsx';

export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="empty">
      <Icon name={icon} />
      <b>{title}</b>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}