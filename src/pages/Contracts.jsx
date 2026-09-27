import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { fmtINR, fmtDate } from '../utils/format.js';

export default function Contracts() {
  const state = useAppStore();
  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Contracts</h1>
          <p>{state.contracts.length} contracts · milestone-linked payments</p>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Contract</th><th>Challenge</th><th>Startup</th><th>Value</th><th>Period</th><th>Status</th></tr></thead>
          <tbody>
            {state.contracts.map(ct => {
              const ch = state.challenges.find(c => c.id === ct.challengeId);
              const s = state.startups.find(x => x.id === ct.startupId);
              return (
                <tr key={ct.id}>
                  <td><Link to={`/contracts/${ct.id}`} className="mono" style={{ fontWeight: 700, color: 'var(--primary)' }}>{ct.id}</Link></td>
                  <td style={{ maxWidth: 280 }}>{ch?.title}</td>
                  <td><b>{s?.name}</b></td>
                  <td><b>{fmtINR(ct.value)}</b></td>
                  <td className="muted small">{fmtDate(ct.start)} → {fmtDate(ct.end)}</td>
                  <td><Badge status={ct.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}