import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.jsx';
import { Icon } from '../components/Icons.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useToast } from '../components/ui/Toast.jsx';
import { fmtINR, fmtDate } from '../utils/format.js';
import { downloadContract } from '../utils/contractDownload.js';

export default function Contracts() {
  const state = useAppStore();
  const toast = useToast();
  const navigate = useNavigate();

  const handleDownload = (ct, e) => {
    e.stopPropagation();
    const challenge = state.challenges.find(c => c.id === ct.challengeId);
    const startup = state.startups.find(s => s.id === ct.startupId);
    downloadContract({ contract: ct, challenge, startup });
    toast.success('Contract download started', `${ct.id}.pdf`);
  };

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Contracts</h1>
          <p>{state.contracts.length} contracts · milestone-linked payments · printable PDFs</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-secondary"><Icon name="download" />Export all</button>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Challenge</th>
              <th>Vendor</th>
              <th>Value</th>
              <th>Period</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.contracts.map(ct => {
              const ch = state.challenges.find(c => c.id === ct.challengeId);
              const s = state.startups.find(x => x.id === ct.startupId);
              return (
                <tr key={ct.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/contracts/${ct.id}`)}>
                  <td><span className="mono" style={{ fontWeight: 700 }}>{ct.id}</span></td>
                  <td style={{ maxWidth: 320 }}>
                    <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{ch?.title}</div>
                    <div className="xsmall muted">{ch?.dept}</div>
                  </td>
                  <td><b>{s?.name}</b></td>
                  <td><b>{fmtINR(ct.value)}</b></td>
                  <td className="muted small">{fmtDate(ct.start)} → {fmtDate(ct.end)}</td>
                  <td><Badge status={ct.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => handleDownload(ct, e)}
                        title="Download contract as PDF"
                      >
                        <Icon name="download" />Download
                      </button>
                      <Link
                        className="btn btn-ghost btn-sm"
                        to={`/contracts/${ct.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon name="eye" />View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}