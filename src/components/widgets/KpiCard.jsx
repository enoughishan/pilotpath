import { Icon } from '../Icons.jsx';

export function KpiCard({ label, value, sub, accent = 'blue', iconName, onClick }) {
  const Comp = onClick ? 'a' : 'div';
  return (
    <Comp
      className={`kpi ${onClick ? 'clickable' : ''}`}
      href={onClick}
      onClick={onClick && !onClick.startsWith('#') ? onClick : undefined}
    >
      <span className={`kpi-accent ${accent}`} />
      <div className="kpi-label">
        {iconName && <Icon name={iconName} />}
        {label}
      </div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </Comp>
  );
}