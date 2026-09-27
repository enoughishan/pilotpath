import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.jsx';
import { KpiChartCard } from '../components/widgets/KpiChartCard.jsx';
import { LineChart } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { Icon } from '../components/Icons.jsx';

export default function Monitoring() {
  const pilots = useAppStore(s => s.pilots);
  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Monitoring</h1>
          <p>Live KPI tracking and risk monitoring for active pilots</p>
        </div>
      </div>
      {pilots.map(p => (
        <div className="card" key={p.id} style={{ marginBottom: 16 }}>
          <div className="card-head">
            <div>
              <h3>{p.title}</h3>
              <p>{p.id} · {p.geography} · {p.progress}% complete</p>
            </div>
            <Link className="btn btn-secondary btn-sm" to={`/pilots/${p.id}`}><Icon name="eye" />View</Link>
          </div>
          <div className="card-pad">
            <div className="grid g-3" style={{ marginBottom: 16 }}>
              {p.kpis.map((k, i) => <KpiChartCard key={i} kpi={k} />)}
            </div>
            <LineChart
              series={[{ name: 'KPI', color: 'var(--primary)', data: (p.trend || []).map(t => t.loss) }]}
              labels={(p.trend || []).map(t => t.week)}
              height={140}
            />
          </div>
        </div>
      ))}
    </div>
  );
}