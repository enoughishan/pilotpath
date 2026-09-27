import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { STAGES } from '../data/seed.js';
import { fmtLakh, fmtINR } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';

/* ---------- Department icon map ---------- */
const DEPT_ICON = {
  'Urban Development Department': 'building',
  'Public Works Department': 'landmark',
  'Water Resources Department': 'globe',
  'Public Health Department': 'shieldCheck',
  'Medical Education & Drugs': 'award',
  'School Education Department': 'fileText',
  'Higher & Technical Education': 'templates',
  'Transport Department': 'trendingUp',
  'Agriculture Department': 'globe',
  'Energy Department': 'zap',
  'Environment Department': 'globe',
  'Information Technology Directorate': 'grid'
};

/* ---------- Mock news data (like india.gov.in) ---------- */
const NEWS_ITEMS = [
  {
    date: '27',
    month: 'Sep',
    tag: 'Mann Ki Baat',
    title: 'Hon\u2019ble Prime Minister\u2019s address on 27th September 2026',
    desc: 'Key highlights on digital governance, innovation, and citizen service delivery through state portals.'
  },
  {
    date: '25',
    month: 'Sep',
    tag: 'Press Release',
    title: 'Maharashtra Innovation Cell publishes Q2 pilot outcomes',
    desc: 'Four pilots validated this quarter across water, health, and streetlight operations with independent evidence.'
  },
  {
    date: '22',
    month: 'Sep',
    tag: 'Notification',
    title: 'Updated evaluation rubric v3.0 takes effect from Oct 1, 2026',
    desc: 'Revised weights for technical feasibility, impact potential, and cybersecurity compliance across all new challenges.'
  },
  {
    date: '20',
    month: 'Sep',
    tag: 'Scheme Update',
    title: 'SMILE Scheme integrated for cross-department pilot discovery',
    desc: 'Innovation Cell announces partnership to surface SMILE-linked pilots within उद्भव governance workflow.'
  }
];

export default function Dashboard() {
  const state = useAppStore();
  const { user, role, district, department } = useSession();
  const navigate = useNavigate();
  const toast = useToast();

  /* ---------- Derived data ---------- */
  const pilotValue = state.pilots.reduce((a, p) => a + (p.budget || 0), 0);
  const activeChallenges = state.challenges.filter(c => c.stage !== 'SCALE_UP').length;
  const runningPilots = state.pilots.filter(p => p.status === 'Active').length;
  const paidTotal = state.payments
    .filter(p => p.status === 'PAID')
    .reduce((a, p) => a + p.amount, 0);
  const validationRate = state.pilots.length
    ? Math.round(
        (state.validations.filter(v => v.status === 'Validated').length /
          state.pilots.length) * 100
      )
    : 0;

  /* ---------- Featured challenges ---------- */
  const featuredChallenges = useMemo(() => {
    return state.challenges
      .filter(c => c.stage !== 'CHALLENGE')
      .slice(0, 6);
  }, [state.challenges]);

  /* ---------- Spotlight (top validated pilot) ---------- */
  const spotlightPilot = state.pilots.find(p => p.status === 'Validated') ||
    state.pilots.find(p => p.status === 'Active') ||
    state.pilots[0];
  const spotlightChallenge = spotlightPilot
    ? state.challenges.find(c => c.id === spotlightPilot.challengeId)
    : null;
  const spotlightStartup = spotlightPilot
    ? state.startups.find(s => s.id === spotlightPilot.startupId)
    : null;

  /* ---------- Department counts ---------- */
  const deptCounts = useMemo(() => {
    const counts = {};
    state.challenges.forEach(c => {
      counts[c.dept] = (counts[c.dept] || 0) + 1;
    });
    return counts;
  }, [state.challenges]);

  /* ---------- Eligibility form ---------- */
  const [eligibility, setEligibility] = useState({
    dept: '',
    district: '',
    stage: ''
  });

  const handleEligibilitySubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (eligibility.dept) params.set('dept', eligibility.dept);
    if (eligibility.district) params.set('district', eligibility.district);
    if (eligibility.stage) params.set('stage', eligibility.stage);
    toast.info('Finding matching challenges…', `${Object.values(eligibility).filter(Boolean).length} filters applied`);
    navigate(`/challenges${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="content">
      {/* ============ UTILITY STRIP ============ */}
      <div className="i-utility">
        <div className="i-utility-left">
          <span className="i-utility-item">
            <Icon name="globe" />
            Government of Maharashtra
          </span>
          <span className="i-utility-divider" />
          <span className="i-utility-item">
            <Icon name="shieldCheck" />
            NIC-compliant
          </span>
          <span className="i-utility-divider" />
          <span className="i-utility-item">
            <Icon name="clock" />
            Last updated: 28 Sep 2026, 09:00 IST
          </span>
        </div>
        <div className="i-utility-right">
          <span className="i-utility-item">
            <Icon name="info" />
            Screen reader
          </span>
          <span className="i-utility-divider" />
          <span className="i-utility-item">
            <Icon name="file" />
            A- A A+
          </span>
          <span className="i-utility-divider" />
          <span className="i-utility-item">
            <Icon name="globe" />
            English
          </span>
        </div>
      </div>

      {/* ============ NEWS TICKER ============ */}
      <div className="news-ticker">
        <div className="news-ticker-label">Latest</div>
        <div className="news-ticker-track">
          <div className="news-ticker-content">
            {[...NEWS_ITEMS, ...NEWS_ITEMS].map((n, i) => (
              <span key={i}>
                <b>{n.tag}:</b> {n.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ HERO BAND ============ */}
      <section className="hero-band">
        <div className="hero-inner">
          <div>
            <div className="hero-chip">
              <span className="dot" />
              <span>
                Government of Maharashtra · <strong>Innovation Cell</strong>
              </span>
            </div>

            <h1 className="hero-title">
              From a department's problem
              <br />
              to a <span className="accent">paid, proven pilot.</span>
            </h1>

            <p className="hero-subtitle">
              उद्भव is the official innovation procurement pathway for Maharashtra
              government departments. Publish outcome-based challenges, discover
              DPIIT-recognised startups, run controlled pilots, and pay only against
              independently verified milestones.
            </p>

            <div className="hero-ctas">
              <Link className="btn-hero-primary" to="/challenges">
                <Icon name="play" />
                Explore Challenges
              </Link>
              {role === 'officer' && (
                <Link className="btn-hero-secondary" to="/challenges/new">
                  <Icon name="plus" />
                  Publish New Challenge
                </Link>
              )}
              {role !== 'officer' && (
                <Link className="btn-hero-secondary" to="/pathway">
                  <Icon name="pathway" />
                  View Pathway Board
                </Link>
              )}
            </div>

            <div className="hero-trust">
              <span className="hero-trust-item">
                <Icon name="shieldCheck" />
                Tamper-proof audit chain
              </span>
              <span className="hero-trust-divider" />
              <span className="hero-trust-item">
                <Icon name="checkCircle" />
                10-stage gate controlled
              </span>
              <span className="hero-trust-divider" />
              <span className="hero-trust-item">
                <Icon name="clock" />
                30-day payment SLA
              </span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card" style={{ '--stat-accent': '#1B4D89' }}>
              <div className="stat-value blue">{activeChallenges}</div>
              <div className="stat-label">Active Challenges</div>
              <div className="stat-sub">Across all departments</div>
            </div>
            <div className="stat-card" style={{ '--stat-accent': '#047857' }}>
              <div className="stat-value green">{runningPilots}</div>
              <div className="stat-label">Running Pilots</div>
              <div className="stat-sub">Controlled trials</div>
            </div>
            <div className="stat-card" style={{ '--stat-accent': '#B45309' }}>
              <div className="stat-value amber">
                {validationRate}<span className="unit">%</span>
              </div>
              <div className="stat-label">Validation Rate</div>
              <div className="stat-sub">Independently verified</div>
            </div>
            <div className="stat-card" style={{ '--stat-accent': '#6D28D9' }}>
              <div className="stat-value purple">{fmtLakh(paidTotal)}</div>
              <div className="stat-label">Payments Released</div>
              <div className="stat-sub">Milestone-linked</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 1: GOVERNMENT CHALLENGES ============ */}
      <section className="i-section">
        <div className="i-section-head">
          <div className="i-section-head-left">
            <div className="i-section-eyebrow">
              <span className="dot" />
              Government Challenges
            </div>
            <h2 className="i-section-title">Active Innovation Challenges</h2>
            <p className="i-section-sub">
              Outcome-based problem statements published by Maharashtra government
              departments, open for DPIIT-recognised startups to apply.
            </p>
          </div>
          <Link className="i-section-link" to="/challenges">
            View all challenges
            <Icon name="chevronRight" />
          </Link>
        </div>

        <div className="i-scheme-grid">
          {featuredChallenges.map(c => (
            <Link key={c.id} to={`/challenges/${c.id}`} className="i-scheme-card">
              <div className="i-scheme-head">
                <div className="i-scheme-icon">
                  <Icon name={DEPT_ICON[c.dept] || 'challenge'} />
                </div>
                <span className="i-scheme-badge">{c.id}</span>
              </div>
              <div>
                <div className="i-scheme-dept">{c.dept}</div>
                <div className="i-scheme-title">{c.title}</div>
                <div className="i-scheme-desc">{c.problem}</div>
              </div>
              <div className="i-scheme-meta">
                <span className="i-scheme-meta-item">
                  <Icon name="mapPin" />
                  {c.district}
                </span>
                <span className="i-scheme-meta-item">
                  <Icon name="payment" />
                  {fmtLakh(c.budget)}
                </span>
                <span className="i-scheme-meta-item">
                  <Icon name="clock" />
                  {c.duration} days
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ SECTION 2: ELIGIBILITY / MATCHING ============ */}
      <section className="i-section">
        <div className="i-eligibility">
          <div className="i-eligibility-inner">
            <div>
              <div className="i-eligibility-title">
                Find challenges that match your capability.
              </div>
              <p className="i-eligibility-sub">
                Filter live government challenges by department, district, and
                current stage. Verified startups can apply directly through the
                portal.
              </p>
            </div>
            <form className="i-eligibility-form" onSubmit={handleEligibilitySubmit}>
              <div className="i-eligibility-field">
                <label>Department</label>
                <select
                  value={eligibility.dept}
                  onChange={e => setEligibility({ ...eligibility, dept: e.target.value })}
                >
                  <option value="">All departments</option>
                  {state.departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="i-eligibility-field">
                <label>District</label>
                <select
                  value={eligibility.district}
                  onChange={e => setEligibility({ ...eligibility, district: e.target.value })}
                >
                  <option value="">All districts</option>
                  <option>Pune</option>
                  <option>Mumbai City</option>
                  <option>Mumbai Suburban</option>
                  <option>Nagpur</option>
                  <option>Nashik</option>
                  <option>Thane</option>
                </select>
              </div>
              <div className="i-eligibility-field">
                <label>Stage</label>
                <select
                  value={eligibility.stage}
                  onChange={e => setEligibility({ ...eligibility, stage: e.target.value })}
                >
                  <option value="">Any stage</option>
                  {STAGES.map(s => (
                    <option key={s.key} value={s.key}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="i-eligibility-btn">
                <Icon name="search" />
                Find Matching Challenges
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: NEWS & SPOTLIGHT ============ */}
      <section className="i-section">
        <div className="i-section-head">
          <div className="i-section-head-left">
            <div className="i-section-eyebrow">
              <span className="dot" />
              News &amp; Updates
            </div>
            <h2 className="i-section-title">Latest from the Innovation Cell</h2>
            <p className="i-section-sub">
              Official press releases, notifications, and pilot outcomes from
              Maharashtra government departments.
            </p>
          </div>
          <Link className="i-section-link" to="/audit">
            View all updates
            <Icon name="chevronRight" />
          </Link>
        </div>

        <div className="i-news-grid">
          {/* Main news list */}
          <div className="i-news-main">
            <div className="i-news-list">
              {NEWS_ITEMS.map((n, i) => (
                <div key={i} className="i-news-item" role="button">
                  <div className="i-news-date">
                    <b>{n.date}</b>
                    <span>{n.month}</span>
                  </div>
                  <div className="i-news-body">
                    <div className="i-news-title">{n.title}</div>
                    <div className="i-news-desc">{n.desc}</div>
                    <span className="i-news-tag">{n.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spotlight card */}
          <div className="i-spotlight">
            <div className="i-spotlight-label">
              <Icon name="star" style={{ width: 12, height: 12 }} />
              Spotlight
            </div>
            {spotlightPilot && spotlightChallenge ? (
              <>
                <div className="i-spotlight-title">
                  {spotlightChallenge.title}
                </div>
                <div className="i-spotlight-desc">
                  {spotlightStartup?.name} · {spotlightPilot.geography}
                </div>
                <div className="i-spotlight-stats">
                  {spotlightPilot.kpis.slice(0, 2).map((k, i) => (
                    <div className="i-spotlight-stat" key={i}>
                      <b>
                        {k.current}{k.unit}
                      </b>
                      <span>{k.name}</span>
                    </div>
                  ))}
                  <div className="i-spotlight-stat">
                    <b>{fmtLakh(spotlightPilot.budget)}</b>
                    <span>Pilot value</span>
                  </div>
                  <div className="i-spotlight-stat">
                    <b>{spotlightPilot.progress}%</b>
                    <span>Progress</span>
                  </div>
                </div>
                <Link
                  to={`/pilots/${spotlightPilot.id}`}
                  className="i-section-link"
                  style={{ padding: '8px 0' }}
                >
                  Read full story
                  <Icon name="chevronRight" />
                </Link>
              </>
            ) : (
              <div className="i-spotlight-desc">
                No validated pilots yet. Complete pilots will be featured here.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: STARTUP CONNECT ============ */}
      <section className="i-section">
        <div className="i-connect">
          <div className="i-connect-inner">
            <div className="i-connect-eyebrow">
              <Icon name="startup" style={{ width: 13, height: 13 }} />
              Startup Connect
            </div>
            <h2 className="i-connect-title">
              Building a solution for a government problem?
            </h2>
            <p className="i-connect-sub">
              Register your startup, get DPIIT-recognition assistance, and apply
              to live challenges published across Maharashtra departments.
            </p>
            <div className="i-connect-ctas">
              <Link to="/signin" className="i-connect-btn primary">
                <Icon name="login" />
                Register as Startup
              </Link>
              <Link to="/startups" className="i-connect-btn secondary">
                <Icon name="eye" />
                Browse Startups
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 5: STATS BAND ============ */}
      <section className="i-section">
        <div className="i-stats-band">
          <div className="i-stats-item">
            <div className="i-stats-value">{state.challenges.length}</div>
            <div className="i-stats-label">Challenges Published</div>
          </div>
          <div className="i-stats-item">
            <div className="i-stats-value">{state.startups.length}</div>
            <div className="i-stats-label">DPIIT-recognised Startups</div>
          </div>
          <div className="i-stats-item">
            <div className="i-stats-value">{state.pilots.length}</div>
            <div className="i-stats-label">Controlled Pilots</div>
          </div>
          <div className="i-stats-item">
            <div className="i-stats-value">{fmtLakh(pilotValue)}</div>
            <div className="i-stats-label">Total Pilot Value</div>
          </div>
        </div>
      </section>

      {/* ============ SECTION 6: QUICK LINKS ============ */}
      <section className="i-section">
        <div className="i-section-head">
          <div className="i-section-head-left">
            <div className="i-section-eyebrow">
              <span className="dot" />
              Quick Links
            </div>
            <h2 className="i-section-title">Explore the portal</h2>
          </div>
        </div>

        <div className="i-quick-grid">
          <Link className="i-quick-item" to="/pathway">
            <div className="i-quick-icon"><Icon name="pathway" /></div>
            <div>
              <div className="i-quick-label">Pathway Board</div>
              <div className="i-quick-sub">10-stage flow view</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/pilots">
            <div className="i-quick-icon"><Icon name="pilot" /></div>
            <div>
              <div className="i-quick-label">Active Pilots</div>
              <div className="i-quick-sub">{runningPilots} running</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/evidence">
            <div className="i-quick-icon"><Icon name="evidence" /></div>
            <div>
              <div className="i-quick-label">Evidence Repository</div>
              <div className="i-quick-sub">All pilot evidence</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/analytics">
            <div className="i-quick-icon"><Icon name="analytics" /></div>
            <div>
              <div className="i-quick-label">Analytics</div>
              <div className="i-quick-sub">Programme metrics</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/payments">
            <div className="i-quick-icon"><Icon name="payment" /></div>
            <div>
              <div className="i-quick-label">Payments</div>
              <div className="i-quick-sub">Milestone releases</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/validation">
            <div className="i-quick-icon"><Icon name="validation" /></div>
            <div>
              <div className="i-quick-label">Validation</div>
              <div className="i-quick-sub">Independent verification</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/templates">
            <div className="i-quick-icon"><Icon name="templates" /></div>
            <div>
              <div className="i-quick-label">Templates</div>
              <div className="i-quick-sub">Legal &amp; IP clauses</div>
            </div>
          </Link>
          <Link className="i-quick-item" to="/audit">
            <div className="i-quick-icon"><Icon name="audit" /></div>
            <div>
              <div className="i-quick-label">Audit Trail</div>
              <div className="i-quick-sub">Immutable log</div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}