import React, { useEffect, useRef } from 'react'

const topics = [
  {
    icon: '☁',
    title: 'Azure Multi-Agent Foundry',
    href: '/azure-multi-agent',
    desc: 'Multi-agent ops assistant on Microsoft Foundry. Routes across Azure, DevOps, and Entra ID.',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: 'rgba(22,163,74,0.15)',
    pages: '11 pages',
    iconBg: 'rgba(59,130,246,0.15)',
    accentColor: '#3b82f6',
  },
  {
    icon: '🔗',
    title: 'LangChain',
    href: '/langchain',
    desc: 'Orchestration framework powering our agent chains, memory, and Azure OpenAI connections.',
    status: 'In progress',
    statusColor: '#f59e0b',
    statusBg: 'rgba(245,158,11,0.15)',
    pages: '7 pages',
    iconBg: 'rgba(16,185,129,0.15)',
    accentColor: '#10b981',
  },
  {
    icon: '📦',
    title: 'Container Apps',
    href: '/container-apps',
    desc: 'Serverless platform hosting our agent APIs with scale-to-zero and managed identity.',
    status: 'In progress',
    statusColor: '#f59e0b',
    statusBg: 'rgba(245,158,11,0.15)',
    pages: '7 pages',
    iconBg: 'rgba(139,92,246,0.15)',
    accentColor: '#8b5cf6',
  },
  {
    icon: '⚙',
    title: 'GitHub Actions',
    href: '/github-actions',
    desc: 'CI/CD pipelines for deploying agents and container apps to Azure on every merge.',
    status: 'Being written',
    statusColor: '#a78bfa',
    statusBg: 'rgba(167,139,250,0.15)',
    pages: '7 pages',
    iconBg: 'rgba(251,146,60,0.15)',
    accentColor: '#fb923c',
  },
  {
    icon: '🔐',
    title: 'Azure Secret Governance',
    href: '/azure-secret-governance',
    desc: 'Automated monitoring, alerting, and rotation of Azure App Registration secrets. Raises Jira tickets, sends Teams alerts, and auto-rotates expiring secrets weekly.',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: 'rgba(22,163,74,0.15)',
    pages: '7 pages',
    iconBg: 'rgba(239,68,68,0.15)',
    accentColor: '#ef4444',
  },
]

const steps = [
  { n: '1', title: 'Read the overview for your assigned topic', body: 'Each overview explains what the system does in plain English before touching any code.' },
  { n: '2', title: 'Follow the sidebar pages in order', body: 'Prerequisites before setup, setup before agents. The sidebar order is intentional.' },
  { n: '3', title: 'Study the architecture diagram', body: 'Every topic has a diagram showing how pieces connect. Build the mental model first.' },
  { n: '4', title: 'Read the code examples last', body: 'Real code from our repos, explained inline. Makes sense once you have the context.' },
]

export default function HomePage() {
  const stepsRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Animate steps
    const items = stepsRef.current?.querySelectorAll<HTMLDivElement>('.step-item')
    items?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 300 + i * 130)
    })
    // Animate cards
    const cards = cardsRef.current?.querySelectorAll<HTMLDivElement>('.topic-card')
    cards?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 200 + i * 100)
    })
  }, [])

  return (
    <div style={{ fontFamily: 'inherit', width: '100%', maxWidth: 900, margin: '0 auto' }}>
      <style>{`
        @keyframes floatCenter {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes floatNode {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-ring {
          0% { transform: translateX(-50%) scale(1); opacity: 0.4; }
          100% { transform: translateX(-50%) scale(1.6); opacity: 0; }
        }
        @keyframes grid-fade {
          0%,100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }
        .agent-node {
          position: absolute;
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
        }
        .n1 {
          top: 0; left: 50%;
          animation: floatCenter 3s ease-in-out infinite;
          color: #93c5fd;
          border: 1px solid rgba(147,197,253,0.3);
          background: rgba(59,130,246,0.15);
        }
        .n2 {
          top: 65px; left: 0;
          animation: floatNode 3s ease-in-out infinite;
          animation-delay: .3s;
          color: #86efac;
          border: 1px solid rgba(134,239,172,0.3);
          background: rgba(22,163,74,0.12);
        }
        .n3 {
          top: 65px; right: 0;
          animation: floatNode 3s ease-in-out infinite;
          animation-delay: .6s;
          color: #c4b5fd;
          border: 1px solid rgba(196,181,253,0.3);
          background: rgba(139,92,246,0.12);
        }
        .n4 {
          bottom: 0; left: 50%;
          animation: floatCenter 3s ease-in-out infinite;
          animation-delay: .9s;
          color: #fcd34d;
          border: 1px solid rgba(252,211,77,0.3);
          background: rgba(245,158,11,0.12);
        }
        .pulse-ring {
          position: absolute;
          top: 0; left: 50%;
          width: 80px; height: 80px;
          margin-top: -20px; margin-left: -40px;
          border-radius: 50%;
          border: 1px solid rgba(147,197,253,0.3);
          animation: pulse-ring 2.5s ease-out infinite;
          pointer-events: none;
        }
        .topic-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 1.25rem;
          text-decoration: none;
          display: block;
          transition: border-color .2s, background .2s, transform .2s;
          opacity: 0;
          transform: translateY(12px);
        }
        .topic-card:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-2px) !important;
        }
        .start-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #2563eb;
          color: #fff;
          border-radius: 8px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background .15s, transform .15s;
        }
        .start-btn:hover { background: #1d4ed8; transform: translateY(-1px); }
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-fade 4s ease-in-out infinite;
          pointer-events: none;
          border-radius: 16px;
        }
        .glow-dot {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: .875rem 1.25rem;
          flex: 1;
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', padding: '3rem 2rem 2.5rem', marginBottom: '2rem', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="grid-bg" />
        <div className="glow-dot" style={{ width: 300, height: 300, background: 'rgba(59,130,246,0.08)', top: -100, right: -50 }} />
        <div className="glow-dot" style={{ width: 200, height: 200, background: 'rgba(139,92,246,0.06)', bottom: -80, left: 100 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#93c5fd', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', padding: '4px 12px', borderRadius: 20, marginBottom: '1.5rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            Internal knowledge base
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px', gap: '2rem', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: 38, fontWeight: 700, lineHeight: 1.12, marginBottom: '.875rem', margin: '0 0 .875rem', background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Azure AI<br />Engineering Hub
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#64748b', marginBottom: '1.75rem', maxWidth: 380 }}>
                Everything the team has built and learned — so new joiners can get up to speed without digging through code.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a href="/azure-multi-agent" className="start-btn">🚀 Start here</a>
                <a href="/azure-multi-agent" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                  Browse topics →
                </a>
              </div>
            </div>

            {/* Animated diagram */}
            <div style={{ position: 'relative', width: 220, height: 180, flexShrink: 0 }}>
              <div className="pulse-ring" />
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <defs>
                  <marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                  </marker>
                </defs>
                <line x1="110" y1="34" x2="48" y2="67" stroke="#334155" strokeWidth="1" markerEnd="url(#ah)" />
                <line x1="110" y1="34" x2="172" y2="67" stroke="#334155" strokeWidth="1" markerEnd="url(#ah)" />
                <line x1="110" y1="34" x2="110" y2="145" stroke="#334155" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#ah)" />
              </svg>
              <div className="agent-node n1">⚡ ParentAgent</div>
              <div className="agent-node n2">☁ Azure</div>
              <div className="agent-node n3">🔧 DevOps</div>
              <div className="agent-node n4">🎫 Jira</div>
            </div>
          </div>

          {/* Stats — updated to reflect 5 topics, 2 ready */}
          <div style={{ display: 'flex', gap: 10, marginTop: '2rem' }}>
            {[['5', 'Topics covered', '#3b82f6'], ['2', 'Ready to read', '#10b981'], ['3', 'In progress', '#f59e0b'], ['Jul 2026', 'Last updated', '#8b5cf6']].map(([val, label, color]) => (
              <div key={label} className="stat-card">
                <div style={{ fontSize: 20, fontWeight: 700, color: color as string, marginBottom: 2 }}>{val}</div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Topics ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', marginBottom: '1rem', padding: '0 0.25rem' }}>Topics</div>
        <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {topics.map((t) => (
            <a key={t.href} href={t.href} className="topic-card">
              <div style={{ width: 34, height: 34, borderRadius: 8, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.875rem', fontSize: 17, border: `1px solid ${t.accentColor}22` }}>
                {t.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {t.title}
                <span style={{ fontSize: 16, color: t.accentColor }}>→</span>
              </div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: '.75rem' }}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 20, background: t.statusBg, color: t.statusColor, border: `1px solid ${t.statusColor}33` }}>{t.status}</span>
                <span style={{ fontSize: 11, color: '#334155' }}>{t.pages}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── New joiner guide ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#475569', marginBottom: '1.25rem' }}>New joiner guide</div>
        <div ref={stepsRef}>
          {steps.map((s, i) => (
            <div key={s.n} className="step-item" style={{ display: 'flex', gap: '1rem', padding: '.875rem 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', opacity: 0, transform: 'translateY(10px)', transition: 'opacity .4s, transform .4s' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, border: '1px solid rgba(59,130,246,0.25)' }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Callout ── */}
      <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
        <p style={{ fontSize: 13, color: '#93c5fd', lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: '#bfdbfe' }}>Adding new content?</strong> Create a folder under <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>pages/</code> with an <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>index.mdx</code> and <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>_meta.json</code>. No HTML needed — just plain text.
        </p>
      </div>
    </div>
  )
}
