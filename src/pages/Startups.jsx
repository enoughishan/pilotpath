import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { DISTRICTS } from '../data/seed.js';
import { matchScore } from '../utils/scoring.js';
import { fmtLakh, initials } from '../utils/format.js';

export default function Startups() {
  const state = useAppStore();
  const [filters, setFilters] = useState({ q: '', industry: '', district: '' });

  const industries = useMemo(
    () => [...new Set(state.startups.map(s => s.industry))],
    [state.startups]
  );

  const filtered = state.startups.filter(s =>
    (!filters.industry || s.industry === filters.industry) &&
    (!filters.district || s.district === filters.district) &&
    (!filters.q ||
      (s.name + s.tech + s.industry).toLowerCase().includes(filters.q.toLowerCase()))
  );

  const hasFilters = Object.values(filters).some(v => v);

  /* Stats */
  const totalStartups = state.startups.length;
  const dpiitCount = state.startups.filter(s =>
    (s.certs || []).includes('DPIIT')
  ).length;
  const isoCount = state.startups.filter(s =>
    (s.certs || []).includes('ISO 27001')
  ).length;
  const avgReadiness = state.startups.length
    ? Math.round(
        state.startups.reduce((a, s) => a + s.readiness, 0) / state.startups.length
      )
    : 0;

  return (
    <div className="content">
      {/* ================ PAGE HERO ================ */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">
          <span className="dot" />
          Startup &amp; vendor registry
        </div>
        <h1 className="page-hero-title">Startup Discovery</h1>
        <p className="page-hero-sub">
          DPIIT-recognised startups and MSMEs registered under उद्भव. Match
          signals are transparent and criterion-level — no opaque scores.
        </p>
        <div className="page-hero-meta">
          <span><Icon name="startup" /> <b>{totalStartups}</b> registered</span>
          <span><Icon name="checkCircle" /> <b>{dpiitCount}</b> DPIIT-recognised</span>
          <span><Icon name="shield" /> <b>{isoCount}</b> ISO 27001</span>
          <span><Icon name="target" /> <b>{avgReadiness}%</b> avg readiness</span>
        </div>
      </div>

      {/* ================ STAT STRIP ================ */}
      <div className="stat-strip">
        <div className="stat-tile" style={{ '--tile-accent': '#1B4D89' }}>
          <div className="stat-tile-label">
            <Icon name="startup" />
            Registered Startups
          </div>
          <div className="stat-tile-value">{totalStartups}</div>
          <div className="stat-tile-sub">Active on platform</div>
        </div>
        <div className="stat-tile" style={{ '--tile-accent': '#047857' }}>
          <div className="stat-tile-label">
            <Icon name="checkCircle" />
            DPIIT-recognised
          </div>
          <div className="stat-tile-value">{dpiitCount}</div>
          <div className="stat-tile-sub">Eligible for pilots</div>
        </div>
        <div className="stat-tile" style={{ '--tile-accent': '#6D28D9' }}>
          <div className="stat-tile-label">
            <Icon name="shield" />
            ISO 27001 Certified
          </div>
          <div className="stat-tile-value">{isoCount}</div>
          <div className="stat-tile-sub">Security compliant</div>
        </div>
        <div className="stat-tile" style={{ '--tile-accent': '#B45309' }}>
          <div className="stat-tile-label">
            <Icon name="target" />
            Avg Pilot Readiness
          </div>
          <div className="stat-tile-value">{avgReadiness}%</div>
          <div className="stat-tile-sub">Deployment ready</div>
        </div>
      </div>

      {/* ================ FILTER BAR ================ */}
      <div className="filter-bar-premium">
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Icon
            name="search"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 15,
              height: 15,
              color: 'var(--text-4)'
            }}
          />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Search by name, technology, or industry…"
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <select
          className="select"
          value={filters.industry}
          onChange={e => setFilters({ ...filters, industry: e.target.value })}
        >
          <option value="">All industries</option>
          {industries.map(i => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <select
          className="select"
          value={filters.district}
          onChange={e => setFilters({ ...filters, district: e.target.value })}
        >
          <option value="">All districts</option>
          {DISTRICTS.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFilters({ q: '', industry: '', district: '' })}
          >
            <Icon name="x" />
            Clear
          </button>
        )}
      </div>

      {/* ================ CARD GRID ================ */}
      {filtered.length ? (
        <div className="premium-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {filtered.map(s => {
            const challenge =
              state.challenges.find(c => c.industry === s.industry) ||
              state.challenges[0];
            const ms = matchScore(s, challenge);
            return (
              <Link key={s.id} to={`/startups/${s.id}`} className="startup-card">
                <div className="startup-card-header">
                  <div className="startup-card-logo">{initials(s.name)}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="startup-card-name">{s.name}</div>
                    <div className="startup-card-tech">{s.tech}</div>
                  </div>
                </div>

                <div className="startup-card-tags">
                  <span className="startup-tag">
                    <Icon name="mapPin" />
                    {s.district}
                  </span>
                  <span className="startup-tag">
                    <Icon name="building" />
                    {s.industry}
                  </span>
                  <span className="startup-tag">
                    <Icon name="award" />
                    {s.stage}
                  </span>
                </div>

                <div className="startup-card-stats">
                  <div>
                    <div className="startup-stat-label">Match</div>
                    <div className="startup-stat-value accent">{ms.overall}%</div>
                  </div>
                  <div>
                    <div className="startup-stat-label">Deployments</div>
                    <div className="startup-stat-value">{s.deployments}</div>
                  </div>
                  <div>
                    <div className="startup-stat-label">Est. cost</div>
                    <div className="startup-stat-value">{fmtLakh(s.cost)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(s.certs || []).slice(0, 3).map(cert => (
                    <span
                      key={cert}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        background: 'var(--success-50)',
                        color: 'var(--success)',
                        border: '1px solid var(--success-100)',
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 650
                      }}
                    >
                      <Icon name="shield" style={{ width: 10, height: 10 }} />
                      {cert}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="empty-premium">
          <Icon name="startup" />
          <b>No startups match your filters</b>
          <p>Try clearing the search or selecting a different industry or district.</p>
        </div>
      )}
    </div>
  );
}