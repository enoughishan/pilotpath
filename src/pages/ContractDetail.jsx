import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Icon } from '../components/Icons.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useToast } from '../components/ui/Toast.jsx';
import { fmtINR, fmtDate } from '../utils/format.js';
import { downloadContract } from '../utils/contractDownload.js';

export default function ContractDetail() {
  const { id } = useParams();
  const state = useAppStore();
  const toast = useToast();
  const ct = state.contracts.find(x => x.id === id);
  if (!ct) return <div className="content"><EmptyState icon="alert" title="Contract not found" /></div>;

  const ch = state.challenges.find(c => c.id === ct.challengeId);
  const s = state.startups.find(x => x.id === ct.startupId);
  const pays = state.payments.filter(p => p.contractId === ct.id);

  const handleDownload = () => {
    downloadContract({ contract: ct, challenge: ch, startup: s });
    toast.success('Contract download started', `${ct.id}.pdf`);
  };

  const clauses = [
    { n: 1, title: 'Intellectual Property', body: ct.ipClause },
    { n: 2, title: 'Data Ownership & Sharing', body: ct.dataClause },
    { n: 3, title: 'Security & Compliance', body: ct.securityClause },
    { n: 4, title: 'Payment Terms', body: 'Payments are released against achievement of pre-defined milestones, subject to verification of evidence and independent validation. No payment shall be released without required evidence.' },
    { n: 5, title: 'Termination', body: ct.termination }
  ];

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/contracts">Contracts</Link>
        <Icon name="chevronRight" />
        <span>{ct.id}</span>
      </div>

      {/* ================ DETAIL HERO ================ */}
      <div className="detail-hero">
        <div className="detail-hero-top">
          <span className="detail-hero-id">{ct.id}</span>
          <Badge status={ct.status} />
        </div>

        <h1 className="detail-hero-title">{ch?.title}</h1>

        <div className="detail-hero-meta">
          <span><Icon name="startup" /> <b>{s?.name}</b></span>
          <span><Icon name="building" /> <b>{ch?.dept}</b></span>
          <span><Icon name="calendar" /> Signed {fmtDate(ct.signedAt)}</span>
          <span><Icon name="payment" /> <b>{fmtINR(ct.value)}</b></span>
        </div>
      </div>

      {/* ================ DOWNLOAD CALLOUT ================ */}
      <div className="download-callout">
        <div className="download-callout-icon">
          <Icon name="download" />
        </div>
        <div className="download-callout-body">
          <div className="download-callout-title">Download signed contract</div>
          <div className="download-callout-sub">
            Generates a print-ready PDF with letterhead, clauses, and signature blocks.
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleDownload}>
          <Icon name="download" />
          Download PDF
        </button>
      </div>

      {/* ================ KPI STRIP ================ */}
      <div className="detail-kpi-strip">
        <div className="detail-kpi" style={{ '--kpi-accent': '#1B4D89' }}>
          <div className="detail-kpi-label"><Icon name="payment" />Contract value</div>
          <div className="detail-kpi-value">{fmtINR(ct.value)}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#047857' }}>
          <div className="detail-kpi-label"><Icon name="checkCircle" />Released</div>
          <div className="detail-kpi-value">{fmtINR(pays.filter(p => p.status === 'PAID').reduce((a, p) => a + p.amount, 0))}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#B45309' }}>
          <div className="detail-kpi-label"><Icon name="clock" />Pending</div>
          <div className="detail-kpi-value">{fmtINR(pays.filter(p => p.status !== 'PAID').reduce((a, p) => a + p.amount, 0))}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#6D28D9' }}>
          <div className="detail-kpi-label"><Icon name="calendar" />Duration</div>
          <div className="detail-kpi-value">
            {Math.round((new Date(ct.end) - new Date(ct.start)) / (1000 * 60 * 60 * 24))} days
          </div>
        </div>
      </div>

      {/* ================ BODY ================ */}
      <div className="grid g-2-1">
        <div>
          <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Contract clauses
          </div>
          {clauses.map(cl => (
            <div className="clause-card" key={cl.n}>
              <div className="clause-head">
                <div className="clause-num">{cl.n}</div>
                <div className="clause-title">{cl.title}</div>
              </div>
              <div className="clause-body">{cl.body}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Payment schedule</h3></div>
            <div className="card-pad">
              {pays.length ? pays.map(p => (
                <div className="metric-row" key={p.id}>
                  <div>
                    <div className="mr-label" style={{ fontWeight: 600, color: 'var(--navy)' }}>Milestone {p.milestone}</div>
                    <div className="xsmall muted">{fmtINR(p.amount)}</div>
                  </div>
                  <Badge status={p.status} />
                </div>
              )) : <p className="muted small">No payments recorded.</p>}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Documents</h3></div>
            <div className="card-pad">
              {[
                'Signed contract',
                'IP schedule',
                'Data sharing annex',
                'Security annexure'
              ].map((label, i) => (
                <div className="metric-row" key={i}>
                  <span className="mr-label"><Icon name="file" /> {label}</span>
                  <button className="btn btn-ghost btn-sm" onClick={handleDownload}>
                    <Icon name="download" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}