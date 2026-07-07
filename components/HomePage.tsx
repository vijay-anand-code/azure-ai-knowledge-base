import React, { useEffect, useRef } from 'react'

const topics = [
  {
    icon: '☁',
    title: 'Azure Multi-Agent Foundry',
    href: '/azure-multi-agent',
    desc: 'Multi-agent ops assistant on Microsoft Foundry. Routes across Azure, DevOps, and Entra ID.',
    status: 'Ready',
    statusColor: '#16a34a',
    statusBg: '#dcfce7',
    pages: '11 pages',
    iconBg: '#dbeafe',
  },
  {
    icon: '🔗',
    title: 'LangChain',
    href: '/langchain',
    desc: 'Orchestration framework powering our agent chains, memory, and Azure OpenAI connections.',
    status: 'In progress',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    pages: '7 pages',
    iconBg: '#dcfce7',
  },
  {
    icon: '📦',
    title: 'Container Apps',
    href: '/container-apps',
    desc: 'Serverless platform hosting our agent APIs with scale-to-zero and managed identity.',
    status: 'In progress',
    statusColor: '#d97706',
    statusBg: '#fef3c7',
    pages: '7 pages',
    iconBg: '#ede9fe',
  },
  {
    icon: '⚙',
    title: 'GitHub Actions',
    href: '/github-actions',
    desc: 'CI/CD pipelines for deploying agents and container apps to Azure on every merge.',
    status: 'Being written',
    statusColor: '#9333ea',
    statusBg: '#f3e8ff',
    pages: '7 pages',
    iconBg: '#fef3c7',
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

  useEffect(() => {
    const items = stepsRef.current?.querySelectorAll<HTMLDivElement>('.step-item')
    items?.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 200 + i * 120)
    })
  }, [])

  return (
    <div style={{ fontFamily: 'inherit', width: '100%' }}>
      <style>{`
        @keyframes floatCenter {
          0%,100% { transform: translateX(-50%) translateY(0) }
          50% { transform: translateX(-50%) translateY(-5px) }
        }
        @keyframes floatNode {
          0%,100% { transform: translateY(0) }
          50% { transform: translateY(-5px) }
        }
        .agent-node {
          position: absolute; border-radius: 10px;
          border: 1px solid #e2e8f0; background: #f8fafc;
          padding: 7px 12px; font-size: 12px; font-weight: 600;
          color: #1e293b; white-space: nowrap;
          display: flex; align-items: center; gap: 5px;
        }
        .n1 { top:0; left:50%; animation: floatCenter 3s ease-in-out infinite; color:#1d4ed8; border-color:#93c5fd; background:#dbeafe; }
        .n2 { top:60px; left:0; animation: floatNode 3s ease-in-out infinite; animation-delay:.3s }
        .n3 { top:60px; right:0; animation: floatNode 3s ease-in-out infinite; animation-delay:.6s }
        .n4 { bottom:0; left:50%; animation: floatCenter 3s ease-in-out infinite; animation-delay:.9s }
        .topic-card { transition: border-color .15s, transform .15s; }
        .topic-card:hover { border-color: #93c5fd !important; transform: translateY(-2px); }
      `}</style>

      {/* Hero */}
      <div style={{ padding: '2.5rem 0 2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1d4ed8', background: '#dbeafe', border: '0.5px solid #93c5fd', padding: '3px 10px', borderRadius: 20, marginBottom: '1.25rem' }}>
          Internal knowledge base
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '2rem', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: '.75rem', margin: '0 0 .75rem' }}>
              Azure AI<br />Engineering Hub
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: '#64748b', marginBottom: '1.5rem' }}>
              Everything the team has built and learned — so new joiners can get up to speed without digging through code.
            </p>
            <a href="/azure-multi-agent" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1d4ed8', color: '#fff', borderRadius: 8, padding: '9px 20px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              🚀 Start here
            </a>
          </div>

          {/* Animated diagram */}
          <div style={{ position: 'relative', width: 200, height: 170, flexShrink: 0 }}>
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <line x1="100" y1="30" x2="40" y2="62" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="100" y1="30" x2="160" y2="62" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="100" y1="30" x2="100" y2="140" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 3" />
            </svg>
            <div className="agent-node n1">⚡ ParentAgent</div>
            <div className="agent-node n2">☁ Azure</div>
            <div className="agent-node n3">🔧 DevOps</div>
            <div className="agent-node n4">🎫 Jira</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
          {[['4', 'Topics covered'], ['1', 'Ready to read'], ['3', 'In progress'], ['Jul 2026', 'Last updated']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem' }}>Topics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {topics.map((t) => (
            <a key={t.href} href={t.href} className="topic-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.125rem 1.25rem', textDecoration: 'none', display: 'block' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '.75rem', fontSize: 16 }}>{t.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                {t.title} <span style={{ color: '#94a3b8' }}>→</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55, marginBottom: '.625rem' }}>{t.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: t.statusBg, color: t.statusColor }}>{t.status}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{t.pages}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '1rem' }}>New joiner guide</div>
        <div ref={stepsRef}>
          {steps.map((s) => (
            <div key={s.n} className="step-item" style={{ display: 'flex', gap: '.875rem', padding: '.875rem 0', borderBottom: '1px solid #e2e8f0', opacity: 0, transform: 'translateY(8px)', transition: 'opacity .4s, transform .4s' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: '#dbeafe', color: '#1d4ed8', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Callout */}
      <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 10, padding: '.875rem 1rem', display: 'flex', gap: 8 }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.55, margin: 0 }}>
          <strong>Adding new content?</strong> Create a folder under <code>pages/</code> with an <code>index.mdx</code> and <code>_meta.json</code>. No HTML needed — just plain text.
        </p>
      </div>
    </div>
  )
}

