import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Users,
  ClipboardCheck,
  FileCheck,
  DollarSign,
  ShieldCheck,
  Globe,
  TrendingUp,
  Lock,
  Zap,
  Moon,
  Sun,
  XCircle,
  Database,
  Store,
} from 'lucide-react'
import { Pathway } from '@/components/Pathway'
import type { PathwayStage } from '@/components/Pathway'
import { useDemoStore } from '@/mock/demoClock'
import { useTranslation } from 'react-i18next'

const STATS = [
  { value: '42',   label: 'State Challenges',    color: 'var(--primary)',  sublabel: 'Published this year' },
  { value: '18',   label: 'Active Pilots',        color: 'var(--go)',       sublabel: 'Controlled 90-day trials' },
  { value: '84%',  label: 'Payment SLA Met',      color: 'var(--marker)',   sublabel: 'Within 30-day target' },
  { value: '100%', label: 'Audit Immutable',       color: 'var(--accent)',   sublabel: 'Cryptographic chain' },
]

const FEATURES = [
  {
    icon: Building2,
    title: 'Challenge identification',
    desc: 'Outcome-based problem statements with baselines, targets, data inventory and constraints — not a product specification.',
    color: 'var(--primary-tint)',
    iconColor: 'var(--primary)',
  },
  {
    icon: Users,
    title: 'Discovery & eligibility',
    desc: 'Match against a DPIIT-linked registry, screen on published rules, and waive turnover where the rule allows.',
    color: 'var(--go-tint)',
    iconColor: 'var(--go)',
  },
  {
    icon: ClipboardCheck,
    title: 'Expert evaluation',
    desc: 'Blind weighted rubrics, conflict declarations and ranking lock before any vendor is named in committee.',
    color: 'var(--accent-tint)',
    iconColor: 'var(--accent)',
  },
  {
    icon: DollarSign,
    title: 'Pilot, contract & pay',
    desc: 'Sandbox design, data/IP and cyber clauses, milestone evidence, and a 30-day payment SLA.',
    color: 'var(--marker-tint)',
    iconColor: 'var(--marker)',
  },
  {
    icon: FileCheck,
    title: 'Independent validation',
    desc: 'A test-lab validator signs KPI verdicts. Scale-up cannot proceed on departmental self-assessment alone.',
    color: 'var(--go-tint)',
    iconColor: 'var(--go)',
  },
  {
    icon: TrendingUp,
    title: 'Evidence-based scale-up',
    desc: 'Dossier grade maps to GeM, limited tender or repeat-order — without skipping statutory procurement.',
    color: 'var(--primary-tint)',
    iconColor: 'var(--primary)',
  },
]

const PERSONAS = [
  {
    role: 'officer' as const,
    name: 'Meera Kulkarni',
    title: 'Joint Director',
    dept: 'Urban Development Department',
    desc: 'Publish challenges, manage the 10-stage pipeline, approve scale-up decisions',
    route: '/app/pathway',
    color: '#2563EB',
    bg: '#EFF6FF',
    darkBg: '#172039',
    emoji: '🏛️',
  },
  {
    role: 'evaluator' as const,
    name: 'Dr. Arvind Rao',
    title: 'External Evaluator',
    dept: 'Domain Expert Panel',
    desc: 'Score shortlisted startups against weighted criteria rubrics',
    route: '/app/evaluator/queue',
    color: '#D97706',
    bg: '#FEF3C7',
    darkBg: '#271E06',
    emoji: '⚖️',
  },
  {
    role: 'startup' as const,
    name: 'Sana Iqbal',
    title: 'Co-founder & CEO',
    dept: 'Aquavrit Systems',
    desc: 'Discover challenges, apply, run your pilot, track milestone payments',
    route: '/app/startup/home',
    color: '#059669',
    bg: '#D1FAE5',
    darkBg: '#052E1C',
    emoji: '🚀',
  },
  {
    role: 'validator' as const,
    name: 'Prof. Nandini Bose',
    title: 'Principal Validator',
    dept: 'State Engineering Test Lab',
    desc: 'Independently verify pilot results and issue grade certificates',
    route: '/app/validator/assignments',
    color: '#DC2626',
    bg: '#FEE2E2',
    darkBg: '#2D0B0B',
    emoji: '🔬',
  },
  {
    role: 'finance' as const,
    name: 'Rakesh Menon',
    title: 'Accounts Officer',
    dept: 'Finance Department',
    desc: 'Verify milestone evidence, approve and release payments within SLA',
    route: '/app/finance/payments',
    color: '#475569',
    bg: '#F1F5F9',
    darkBg: '#1E293B',
    emoji: '💳',
  },
  {
    role: 'admin' as const,
    name: 'Farah Sheikh',
    title: 'Innovation Cell Admin',
    dept: 'Central Programme Office',
    desc: 'Configure rules, rubrics, templates and cross-department demand board',
    route: '/app/admin/overview',
    color: '#7C3AED',
    bg: '#EDE9FE',
    darkBg: '#1F1547',
    emoji: '⚙️',
  },
]

const PAIN = [
  'Tenders written for standardised goods, not novel technology',
  'Startups blocked by turnover and prior-experience bars',
  'No sandbox, unclear IP/data, and unpaid milestone drift',
  'Success cannot be evidenced, so scale-up stalls in committee',
]

const GAIN = [
  'Published outcome challenges with KPI baselines and call windows',
  'Rule-based screening with recorded DPIIT relaxations',
  'Dual-accepted pilots, cyber checklist, and SLA-clocked pay',
  'Validator-signed dossier feeding a named GeM or tender path',
]

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { setActiveRole, setLanguage, language } = useDemoStore()
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
  )

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  const landingStages: PathwayStage[] = [
    { id: 1,  name: 'Challenge',    status: 'done',    sublabel: 'Published' },
    { id: 2,  name: 'Discovery',    status: 'done',    sublabel: 'Matched' },
    { id: 3,  name: 'Screening',    status: 'done',    sublabel: 'Shortlisted' },
    { id: 4,  name: 'Evaluation',   status: 'done',    sublabel: 'Scored' },
    { id: 5,  name: 'Pilot Design', status: 'done',    sublabel: 'Approved' },
    { id: 6,  name: 'Contract',     status: 'done',    sublabel: 'Signed' },
    { id: 7,  name: 'Monitoring',   status: 'current', sublabel: 'Day 45/90' },
    { id: 8,  name: 'Payment',      status: 'upcoming',sublabel: 'Pending' },
    { id: 9,  name: 'Validation',   status: 'upcoming',sublabel: 'Pending' },
    { id: 10, name: 'Scale-up',     status: 'upcoming',sublabel: 'Pending' },
  ]

  const handleSelectPersona = (p: typeof PERSONAS[0]) => {
    setActiveRole(p.role)
    navigate(p.route)
  }

  return (
    <div className="min-h-screen bg-[var(--ground)] text-[var(--ink)]">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 h-16 glass border-b border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-lg grad-brand flex items-center justify-center shadow-[var(--shadow-primary)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 13V5l5-3 5 3v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 13V9h4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-heading font-bold text-[17px] text-[var(--ink)]">Pilot Bridge</span>
            <span className="badge badge-blue hidden sm:inline-flex">Beta</span>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/public')}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors"
            >
              <Globe className="w-4 h-4" />
              Public Dashboard
            </button>

            {/* Lang */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--sunken)] text-[var(--ink-2)] cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[var(--marker)]" />}
            </button>

            <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--line)] overflow-hidden text-xs">
              <button
                onClick={() => { setLanguage('en'); i18n.changeLanguage('en') }}
                className={`px-2.5 py-1 font-bold cursor-pointer transition-colors ${language === 'en' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--ink-2)] hover:bg-[var(--sunken)]'}`}
              >EN</button>
              <button
                onClick={() => { setLanguage('hi'); i18n.changeLanguage('hi') }}
                className={`px-2.5 py-1 font-bold cursor-pointer transition-colors ${language === 'hi' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--ink-2)] hover:bg-[var(--sunken)]'}`}
              >हि</button>
            </div>

            <button
              onClick={() => { const el = document.getElementById('enter-demo'); el?.scrollIntoView({ behavior: 'smooth' }) }}
              className="btn-primary"
            >
              {t('landing.tryDemo')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, var(--glow-a) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-16 -left-16 w-[500px] h-[500px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, var(--glow-b) 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          {/* Eyebrow pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary-muted)] bg-[var(--primary-tint)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span className="text-xs font-bold text-[var(--primary)]">
              Innovation procurement pathway · departments × startups
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8" data-tour="landing-hero">
              <h1 className="text-5xl sm:text-6xl font-bold font-heading text-[var(--ink)] leading-[1.05] tracking-tight">
                {t('landing.heroTitle')}
              </h1>
              <p className="text-xl text-[var(--ink-2)] leading-relaxed font-sans max-w-xl">
                {t('landing.heroSubtitle')}
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { const el = document.getElementById('enter-demo'); el?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="btn-primary text-sm px-6 py-3"
                >
                  Explore the Demo
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/public')}
                  className="btn-ghost text-sm px-6 py-3"
                >
                  Public Transparency Portal
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 text-xs text-[var(--ink-3)]">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Tamper-proof audit chain
                </span>
                <span className="text-[var(--line-strong)]">·</span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  10-stage gate controlled
                </span>
                <span className="text-[var(--line-strong)]">·</span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  30-day payment SLA
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="stat-tile">
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="font-heading font-semibold text-sm text-[var(--ink)]">{s.label}</div>
                  <div className="stat-label">{s.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / PATHWAY ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-6">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--stop)] mb-3">Conventional procurement</div>
            <h2 className="font-heading font-bold text-xl text-[var(--ink)] mb-4">Built for known goods and known vendors</h2>
            <ul className="space-y-3">
              {PAIN.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]">
                  <XCircle className="w-4 h-4 text-[var(--stop)] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 border-[var(--primary-muted)] shadow-[var(--shadow-md)]">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--go)] mb-3">Pilot Bridge mechanism</div>
            <h2 className="font-heading font-bold text-xl text-[var(--ink)] mb-4">A competitive, gated sandbox that can still procure</h2>
            <ul className="space-y-3">
              {GAIN.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--go)] mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PATHWAY STRIP ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-2xl text-[var(--ink)] mb-1">10-Stage Innovation Lifecycle</h2>
          <p className="text-sm text-[var(--ink-3)]">Every challenge travels this controlled pathway from idea to scale</p>
        </div>
        <div className="card p-6 shadow-[var(--shadow-md)]">
          <Pathway stages={landingStages} currentStageId={7} />
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-[var(--ink-3)]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--primary)]" /> Completed stage</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--go)]" /> Active stage</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[var(--sunken-deep)] border border-[var(--line)]" /> Upcoming</span>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-[var(--surface)] border-y border-[var(--line)] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-[var(--ink)] mb-2">End-to-end, not a notice board</h2>
            <p className="text-[var(--ink-2)] text-base max-w-2xl mx-auto">Challenge identification, discovery, screening, evaluation, sandbox design, milestone contracting, measurement, payment, independent validation and scale-up — one audit chain.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="card-hover p-6">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center mb-4"
                    style={{ background: f.color }}>
                    <Icon className="w-5 h-5" style={{ color: f.iconColor }} />
                  </div>
                  <h3 className="font-heading font-bold text-base text-[var(--ink)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--ink-2)] leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ENTER DEMO ── */}
      <section id="enter-demo" className="py-20 relative overflow-hidden">
        <div id="persona-section" className="contents">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, var(--glow-a) 0%, transparent 60%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-[var(--ink)] mb-3">
              {t('landing.continueAs')}
            </h2>
            <p className="text-[var(--ink-2)] text-base max-w-lg mx-auto">
              Choose a role to explore the platform from that perspective. Each persona shows a different view.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONAS.map((p) => (
              <button
                key={p.role}
                onClick={() => handleSelectPersona(p)}
                className="card-hover p-6 text-left group w-full"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center text-2xl shrink-0 shadow-[var(--shadow-sm)]"
                    style={{ background: p.bg }}
                  >
                    {p.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading font-bold text-[15px] text-[var(--ink)] group-hover:text-[var(--primary)] transition-colors">
                        {p.name}
                      </span>
                    </div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: p.color }}>
                      {p.title}
                    </div>
                    <div className="text-xs text-[var(--ink-3)] mb-3">{p.dept}</div>
                    <p className="text-[13px] text-[var(--ink-2)] leading-snug">{p.desc}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--ink-3)]">Enter as {p.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4 text-[var(--primary)] opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                </div>
              </button>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* ── REGISTRY CONNECTORS ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-heading font-bold text-2xl text-[var(--ink)] mb-2">Plugs into recognised registries</h2>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                Discovery can ingest a Startup India / DPIIT export. Scale-up recommendations prefer GeM when the solution is listed. This demo uses a local connector preview — no live credentials.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--sunken)]">
                <Database className="w-4 h-4 text-[var(--primary)]" />
                <div>
                  <div className="text-xs font-bold text-[var(--ink)]">DPIIT / Startup India</div>
                  <div className="text-[10px] text-[var(--ink-3)]">Recognition & turnover waiver</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--sunken)]">
                <Store className="w-4 h-4 text-[var(--go)]" />
                <div>
                  <div className="text-xs font-bold text-[var(--ink)]">GeM marketplace</div>
                  <div className="text-[10px] text-[var(--ink-3)]">Catalogue / limited tender path</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR DEPTS & STARTUPS ── */}
      <section className="bg-[var(--surface)] border-t border-[var(--line)] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

            {/* Departments */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[var(--primary-tint)] border border-[var(--primary-muted)]">
                <Building2 className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-xs font-bold text-[var(--primary)]">For Government Departments</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-[var(--ink)] mb-6">{t('landing.forDepartments')}</h3>
              <ul className="space-y-4">
                {[
                  'Publish outcome-based challenges with KPI baselines, data/IP and budget bands',
                  'Discover and screen startups against published rules — DPIIT waivers recorded',
                  'Design 90-day sandboxes with cyber checklist, risk register and dual acceptance',
                  'Release payments only after verified milestone evidence, inside a 30-day SLA',
                  'Take validator-signed dossiers into GeM or a named compliant procurement path',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--go)] mt-0.5 shrink-0" />
                    <span className="text-sm text-[var(--ink-2)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Startups */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[var(--go-tint)] border border-[var(--go)]" style={{ borderColor: 'rgba(5,150,105,0.3)' }}>
                <Zap className="w-4 h-4 text-[var(--go)]" />
                <span className="text-xs font-bold text-[var(--go)]">For Startups & Innovators</span>
              </div>
              <h3 className="font-heading font-bold text-2xl text-[var(--ink)] mb-6">{t('landing.forStartups')}</h3>
              <ul className="space-y-4">
                {[
                  'See departmental demand before a challenge opens — not after a 200-page RFP',
                  'DPIIT recognition can waive turnover and prior-experience bars where rules allow',
                  'Clear milestones, evidence packs and a visible payment SLA clock',
                  'Keep background IP; license only what the pilot actually produces',
                  'A signed validation report travels with you to other districts and departments',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--go)] mt-0.5 shrink-0" />
                    <span className="text-sm text-[var(--ink-2)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-3)]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded grad-brand flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 13V5l5-3 5 3v8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 13V9h4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-[var(--ink-2)]">Pilot Bridge</span>
            <span>—</span>
            <span>Prototype demo with synthetic data. Not production.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/public')} className="hover:text-[var(--ink)] transition-colors">Transparency Portal</button>
            <span className="text-[var(--line-strong)]">·</span>
            <span>© 2026 Innovation Cell</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
