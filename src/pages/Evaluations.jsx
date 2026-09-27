import { useState } from 'react';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Icon } from '../components/Icons.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { useToast } from '../components/ui/Toast.jsx';
import { weighted } from '../utils/scoring.js';

export default function Evaluations() {
  const state = useAppStore();
  const { role, user } = useSession();
  const toast = useToast();
  const rubric = state.rubric;

  const [scoring, setScoring] = useState(null); // { evaluation, application, startup, challenge }

  const rows = state.evaluations.map(e => {
    const app = state.applications.find(a => a.id === e.applicationId);
    const startup = app ? state.startups.find(s => s.id === app.startupId) : null;
    const challenge = app ? state.challenges.find(c => c.id === app.challengeId) : null;
    const score = weighted(e.scores, rubric);
    return { e, app, startup, challenge, score };
  });

  // Evaluator sees only their own rows
  const myRows = role === 'evaluator'
    ? rows.filter(r => r.e.evaluator === user?.name)
    : rows;

  const openScoring = (row) => {
    setScoring(row);
  };

  const handleSubmit = ({ scores, comments, coi }) => {
    const e = scoring.e;
    state.update('evaluations', e.id, {
      scores,
      comments,
      coi,
      status: 'Submitted',
      submittedAt: new Date().toISOString()
    });
    state.logAudit({
      user: user?.name,
      role: 'Domain Expert',
      action: 'Evaluation submitted',
      entity: e.id,
      details: `Weighted score: ${weighted(scores, rubric)}`
    });
    toast.success('Evaluation submitted', `${e.id} locked successfully`);
    setScoring(null);
  };

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">{role === 'evaluator' ? 'My Evaluations' : 'Evaluations'}</h1>
          <p>Weighted rubric scoring with explainable criteria and COI declarations</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head">
          <div>
            <h3>Active evaluation rubric</h3>
            <p>Weighted criteria · scores are out of 100 per criterion</p>
          </div>
          <span className="badge badge-info">v3.0</span>
        </div>
        <div className="card-pad">
          <div className="grid g-5" style={{ gap: 12 }}>
            {rubric.map(r => (
              <div key={r.key} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)' }}>
                <div className="xsmall muted">Criterion</div>
                <div className="h4" style={{ margin: '4px 0 8px' }}>{r.name}</div>
                <div className="h2" style={{ color: 'var(--primary)' }}>{r.weight}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Evaluation ID</th>
              <th>Startup</th>
              <th>Challenge</th>
              <th>Evaluator</th>
              <th>Weighted score</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {myRows.length ? myRows.map(r => (
              <tr key={r.e.id}>
                <td><span className="mono" style={{ fontWeight: 700 }}>{r.e.id}</span></td>
                <td><b>{r.startup?.name || '—'}</b></td>
                <td className="muted" style={{ maxWidth: 260 }}>{r.challenge?.title || '—'}</td>
                <td className="muted">{r.e.evaluator}</td>
                <td>
                  <b style={{ color: 'var(--primary)' }}>{r.score}</b>
                  <span className="xsmall muted">/100</span>
                </td>
                <td><Badge status={r.e.status} /></td>
                <td style={{ textAlign: 'right' }}>
                  {r.e.status === 'Draft' && role === 'evaluator' ? (
                    <button className="btn btn-primary btn-sm" onClick={() => openScoring(r)}>
                      <Icon name="edit" />Score application
                    </button>
                  ) : r.e.status === 'Submitted' ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => openScoring(r)}>
                      <Icon name="eye" />Review
                    </button>
                  ) : (
                    <span className="muted small">—</span>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7">
                  <EmptyState
                    icon="evaluation"
                    title="No evaluations assigned"
                    body="Applications assigned to you for evaluation will appear here."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {scoring && (
        <ScoringModal
          evaluation={scoring.e}
          application={scoring.app}
          startup={scoring.startup}
          challenge={scoring.challenge}
          rubric={rubric}
          readOnly={scoring.e.status !== 'Draft' || role !== 'evaluator'}
          onClose={() => setScoring(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* ---------- Interactive Scoring Modal ---------- */

function ScoringModal({ evaluation, application, startup, challenge, rubric, readOnly, onClose, onSubmit }) {
  const [scores, setScores] = useState(() => {
    const init = {};
    rubric.forEach(r => {
      init[r.key] = evaluation.scores?.[r.key] ?? 75;
    });
    return init;
  });
  const [comments, setComments] = useState(evaluation.comments || '');
  const [coi, setCoi] = useState(evaluation.coi || false);

  const weightedScore = weighted(scores, rubric);

  const updateScore = (key, value) => {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    setScores({ ...scores, [key]: v });
  };

  const handleSubmit = () => {
    if (!comments.trim()) {
      alert('Please add evaluation comments before submitting.');
      return;
    }
    onSubmit({ scores, comments: comments.trim(), coi });
  };

  return (
    <Modal
      open
      wide
      title={readOnly ? `Evaluation ${evaluation.id}` : `Score Application ${application?.id}`}
      onClose={onClose}
      footer={
        readOnly ? (
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Icon name="check" />Submit Evaluation
            </button>
          </>
        )
      }
    >
      {/* Header: startup + challenge */}
      <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 10, marginBottom: 20 }}>
        <div className="xsmall muted" style={{ marginBottom: 4 }}>Application under evaluation</div>
        <div className="h3">{startup?.name || application?.startupId}</div>
        <div className="small muted" style={{ marginTop: 2 }}>{challenge?.title}</div>
        <div className="xsmall muted" style={{ marginTop: 8 }}>
          {application?.id} · {challenge?.district}, Maharashtra
        </div>
      </div>

      {/* Criteria scoring */}
      <div style={{ marginBottom: 8 }}>
        <h3 className="h3">Weighted criteria</h3>
        <p className="small muted" style={{ marginTop: 2, marginBottom: 16 }}>
          Score each criterion from 0 to 100. The weighted score is calculated automatically.
        </p>
      </div>

      {rubric.map(r => {
        const value = scores[r.key];
        const contribution = (value * r.weight / 100).toFixed(1);
        return (
          <div key={r.key} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div className="h4">{r.name}</div>
                <div className="xsmall muted">Weight: {r.weight}%</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="h3" style={{ color: 'var(--primary)' }}>{value}</div>
                <div className="xsmall muted">contributes {contribution}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                disabled={readOnly}
                onChange={(e) => updateScore(r.key, e.target.value)}
                style={{ flex: 1, accentColor: 'var(--primary)' }}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={value}
                disabled={readOnly}
                onChange={(e) => updateScore(r.key, e.target.value)}
                style={{
                  width: 70,
                  padding: '6px 8px',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  textAlign: 'center',
                  fontWeight: 700,
                  background: readOnly ? 'var(--surface-2)' : 'var(--surface)'
                }}
              />
            </div>

            <div className="progress" style={{ marginTop: 8, height: 4 }}>
              <span style={{ width: `${value}%` }} />
            </div>
          </div>
        );
      })}

      {/* Weighted total */}
      <div style={{
        padding: 16,
        background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--surface) 100%)',
        border: '1px solid var(--primary-100)',
        borderRadius: 10,
        marginBottom: 20,
        textAlign: 'center'
      }}>
        <div className="xsmall muted" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Weighted evaluation score
        </div>
        <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: 6 }}>
          {weightedScore}
          <span style={{ fontSize: 20, color: 'var(--text-3)' }}> / 100</span>
        </div>
      </div>

      {/* Comments */}
      <div className="field">
        <label>Evaluation comments <span className="req">*</span></label>
        <textarea
          className="textarea"
          value={comments}
          disabled={readOnly}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Explain your assessment. Reference specific evidence, technical merit, risks, and any conditions."
          style={{ minHeight: 120 }}
        />
      </div>

      {/* COI */}
      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: 12,
        border: '1px solid var(--border)',
        borderRadius: 8,
        cursor: readOnly ? 'default' : 'pointer',
        background: coi ? 'var(--warning-50)' : 'var(--surface)'
      }}>
        <input
          type="checkbox"
          checked={coi}
          disabled={readOnly}
          onChange={(e) => setCoi(e.target.checked)}
          style={{ marginTop: 3, accentColor: 'var(--warning)' }}
        />
        <div>
          <div className="small" style={{ fontWeight: 650, color: 'var(--navy)' }}>
            Conflict of Interest declaration
          </div>
          <div className="xsmall muted" style={{ marginTop: 2 }}>
            Check this box if you have any actual or potential conflict of interest with this startup.
          </div>
        </div>
      </label>
    </Modal>
  );
}