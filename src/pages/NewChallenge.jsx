import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { useToast } from '../components/ui/Toast.jsx';
import { DEPARTMENTS, DISTRICTS } from '../data/seed.js';
import { fmtINR } from '../utils/format.js';

const STEPS = ['Problem', 'Desired outcome', 'KPIs', 'Eligibility', 'Budget & timeline', 'Risk & compliance', 'Review & publish'];

export default function NewChallenge() {
  const navigate = useNavigate();
  const state = useAppStore();
  const { persona } = useSession();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    kpis: [{ name: '', baseline: '', target: '' }],
    compliance: {}
  });

  const set = (patch) => setData({ ...data, ...patch });

  const next = () => {
    if (step === 1 && (!data.title || !data.dept || !data.district || !data.problem || !data.baseline)) {
      toast.error('Missing fields', 'Title, department, district, problem and baseline are required.'); return;
    }
    if (step === 2 && !data.outcome) { toast.error('Missing outcome'); return; }
    if (step === 3 && !data.kpis.filter(k => k.name && k.baseline && k.target).length) {
      toast.error('No KPIs', 'At least one valid KPI is required.'); return;
    }
    if (step === 5 && (!data.budget || !data.duration)) { toast.error('Budget and duration required'); return; }
    setStep(step + 1);
  };

  const save = (publish) => {
    const id = 'CH-' + String(state.challenges.length + 31).padStart(3, '0');
    const challenge = {
      id,
      title: data.title,
      dept: data.dept,
      district: data.district,
      stage: publish ? 'DISCOVERY' : 'CHALLENGE',
      priority: data.priority || 'Medium',
      day: 0,
      status: publish ? 'Discovering' : 'Draft',
      problem: data.problem,
      baseline: data.baseline,
      outcome: data.outcome,
      users: data.users || '—',
      budget: +data.budget || 1000000,
      duration: +data.duration || 90,
      risk: data.risk || 'Medium',
      kpis: data.kpis.filter(k => k.name).map(k => ({ ...k, current: '—', unit: '', dir: 'up' })),
      compliance: data.compliance,
      tech: data.tech || '—', dataReq: data.dataReq || '—',
      secReq: data.secReq || '—', ipReq: data.ipReq || '—',
      eligibility: data.eligibility || 'DPIIT-recognised startup.'
    };
    state.add('challenges', challenge);
    state.logAudit({ user: persona()?.name, role: 'Government Officer', action: publish ? 'Challenge published' : 'Challenge created', entity: id, details: challenge.title });
    toast.success(publish ? 'Challenge published' : 'Draft saved', `${id} · ${challenge.title}`);
    navigate(`/challenges/${id}`);
  };

  const updateKpi = (i, patch) => {
    const kpis = [...data.kpis];
    kpis[i] = { ...kpis[i], ...patch };
    set({ kpis });
  };

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">New Challenge</h1>
          <p>Step {step} of 7 — {STEPS[step - 1]}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < step ? 'var(--primary)' : 'var(--border)' }} />
        ))}
      </div>

      <div className="card card-pad" style={{ maxWidth: 800 }}>
        {step === 1 && (
          <>
            <div className="field">
              <label>Challenge title <span className="req">*</span></label>
              <input className="input" value={data.title || ''} onChange={(e) => set({ title: e.target.value })}
                placeholder="e.g. Early Flood Alerts for Low-Lying Wards" />
            </div>
            <div className="grid g-2" style={{ gap: 12 }}>
              <div className="field">
                <label>Department <span className="req">*</span></label>
                <select className="select" value={data.dept || ''} onChange={(e) => set({ dept: e.target.value })}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label>District <span className="req">*</span></label>
                <select className="select" value={data.district || ''} onChange={(e) => set({ district: e.target.value })}>
                  <option value="">Select district</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="field">
              <label>Problem description <span className="req">*</span></label>
              <textarea className="textarea" value={data.problem || ''} onChange={(e) => set({ problem: e.target.value })} />
            </div>
            <div className="field">
              <label>Current baseline <span className="req">*</span></label>
              <textarea className="textarea" value={data.baseline || ''} onChange={(e) => set({ baseline: e.target.value })} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="field">
              <label>Desired outcome <span className="req">*</span></label>
              <textarea className="textarea" value={data.outcome || ''} onChange={(e) => set({ outcome: e.target.value })} />
            </div>
            <div className="field">
              <label>Target population / users</label>
              <textarea className="textarea" value={data.users || ''} onChange={(e) => set({ users: e.target.value })} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="small muted" style={{ marginBottom: 12 }}>Define measurable KPIs.</p>
            {data.kpis.map((k, i) => (
              <div className="card card-pad" key={i} style={{ marginBottom: 10, background: 'var(--surface-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <b className="small">KPI {i + 1}</b>
                  {data.kpis.length > 1 && (
                    <button className="btn btn-ghost btn-sm" onClick={() => set({ kpis: data.kpis.filter((_, idx) => idx !== i) })}>
                      <Icon name="x" />
                    </button>
                  )}
                </div>
                <div className="field" style={{ marginBottom: 8 }}>
                  <label>Name</label>
                  <input className="input" value={k.name} onChange={(e) => updateKpi(i, { name: e.target.value })} />
                </div>
                <div className="grid g-2" style={{ gap: 8 }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Baseline</label>
                    <input className="input" value={k.baseline} onChange={(e) => updateKpi(i, { baseline: e.target.value })} />
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>Target</label>
                    <input className="input" value={k.target} onChange={(e) => updateKpi(i, { target: e.target.value })} />
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => set({ kpis: [...data.kpis, { name: '', baseline: '', target: '' }] })}>
              <Icon name="plus" />Add KPI
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="field"><label>Eligibility requirements</label>
              <textarea className="textarea" value={data.eligibility || ''} onChange={(e) => set({ eligibility: e.target.value })} /></div>
            <div className="field"><label>Required technology</label>
              <textarea className="textarea" value={data.tech || ''} onChange={(e) => set({ tech: e.target.value })} /></div>
            <div className="field"><label>Data requirements</label>
              <textarea className="textarea" value={data.dataReq || ''} onChange={(e) => set({ dataReq: e.target.value })} /></div>
            <div className="field"><label>Security requirements</label>
              <textarea className="textarea" value={data.secReq || ''} onChange={(e) => set({ secReq: e.target.value })} /></div>
            <div className="field"><label>IP requirements</label>
              <textarea className="textarea" value={data.ipReq || ''} onChange={(e) => set({ ipReq: e.target.value })} /></div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="grid g-2" style={{ gap: 12 }}>
              <div className="field"><label>Budget (₹) <span className="req">*</span></label>
                <input className="input" type="number" value={data.budget || ''} onChange={(e) => set({ budget: e.target.value })} /></div>
              <div className="field"><label>Duration (days) <span className="req">*</span></label>
                <input className="input" type="number" value={data.duration || ''} onChange={(e) => set({ duration: e.target.value })} /></div>
            </div>
            <div className="field"><label>Priority</label>
              <select className="select" value={data.priority || 'Medium'} onChange={(e) => set({ priority: e.target.value })}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <div className="field"><label>Risk level</label>
              <select className="select" value={data.risk || 'Medium'} onChange={(e) => set({ risk: e.target.value })}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="card card-pad" style={{ background: 'var(--surface-2)' }}>
              <div className="h4" style={{ marginBottom: 10 }}>Compliance checklist</div>
              {[
                ['dataProtection', 'Data protection review'],
                ['cyber', 'Cybersecurity review'],
                ['ip', 'IP clause reviewed'],
                ['procurement', 'Procurement pathway confirmed'],
                ['risk', 'Risk assessment completed']
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!data.compliance[key]}
                    onChange={(e) => set({ compliance: { ...data.compliance, [key]: e.target.checked } })}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                  <span className="small">{label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <div className="card card-pad" style={{ marginBottom: 12 }}>
              <h3 className="h3" style={{ marginBottom: 12 }}>{data.title}</h3>
              <div className="metric-row"><span className="mr-label">Department</span><span className="mr-val">{data.dept}</span></div>
              <div className="metric-row"><span className="mr-label">District</span><span className="mr-val">{data.district}</span></div>
              <div className="metric-row"><span className="mr-label">Budget</span><span className="mr-val">{data.budget ? fmtINR(+data.budget) : '—'}</span></div>
              <div className="metric-row"><span className="mr-label">Duration</span><span className="mr-val">{data.duration} days</span></div>
            </div>
            <div className="card card-pad" style={{ marginBottom: 12 }}>
              <div className="h4" style={{ marginBottom: 8 }}>Problem</div>
              <p className="small">{data.problem}</p>
            </div>
            <div className="card card-pad">
              <div className="h4" style={{ marginBottom: 8 }}>Outcome</div>
              <p className="small">{data.outcome}</p>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          {step > 1 && <button className="btn btn-secondary" onClick={() => setStep(step - 1)}><Icon name="chevronLeft" />Back</button>}
          {step < 7 && <button className="btn btn-primary" onClick={next}>Next<Icon name="chevronRight" /></button>}
          {step === 7 && (
            <>
              <button className="btn btn-secondary" onClick={() => save(false)}>Save as draft</button>
              <button className="btn btn-primary" onClick={() => save(true)}><Icon name="check" />Publish</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}