import { AuditTimeline } from '../components/widgets/AuditTimeline.jsx';
import { useAppStore } from '../store/useAppStore.js';

export default function Audit() {
  const audit = useAppStore(s => s.audit);
  const events = [...audit].sort((a, b) => new Date(b.ts) - new Date(a.ts));
  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left"><h1 className="h1">Audit Log</h1><p>Immutable record of every significant action</p></div>
      </div>
      <div className="card">
        <div className="card-pad"><AuditTimeline events={events} /></div>
      </div>
    </div>
  );
}