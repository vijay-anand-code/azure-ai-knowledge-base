import React, { useEffect, useRef, useState } from 'react'

interface FlowNode {
  icon: string
  label: string
}

interface FlowTrackerProps {
  steps: FlowNode[]
  accent?: string
}

// Floating, scroll-synced rail that tracks the <Steps> block on the page.
// Targets `.nextra-steps h3` headings directly — no extra markup needed in the MDX.
export default function FlowTracker({ steps, accent = '#fb923c' }: FlowTrackerProps) {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const headingsRef = useRef<HTMLElement[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('.nextra-steps h3')
    ).slice(0, steps.length)
    headingsRef.current = headings

    const checkWidth = () => setVisible(window.innerWidth >= 1536 && headings.length > 0)
    checkWidth()
    window.addEventListener('resize', checkWidth)

    const onScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const line = window.scrollY + window.innerHeight * 0.35
        let current = 0
        headingsRef.current.forEach((h, i) => {
          if (h.getBoundingClientRect().top + window.scrollY <= line) current = i
        })
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', checkWidth)
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [steps.length])

  if (!visible) return null

  const trackHeight = steps.length * 46
  const progressPct = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0
  const cssVars = { '--ft-accent': accent } as React.CSSProperties

  return (
    <div className="ft-rail" style={cssVars}>
      <style>{`
        .ft-rail {
          position: fixed;
          right: 28px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px 12px;
          border-radius: 999px;
          background: rgba(12,12,16,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }
        .ft-track {
          position: relative;
          height: ${trackHeight}px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .ft-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          transform: translateX(-50%);
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.14) 12%, rgba(255,255,255,0.14) 88%, transparent);
          border-radius: 2px;
        }
        .ft-line-fill {
          position: absolute;
          left: 50%;
          top: 0;
          width: 2px;
          transform: translateX(-50%);
          background: var(--ft-accent);
          border-radius: 2px;
          height: ${progressPct}%;
          transition: height .35s ease;
          box-shadow: 0 0 8px var(--ft-accent);
        }
        .ft-dot {
          position: absolute;
          left: 50%;
          width: 5px;
          height: 5px;
          margin-left: -2.5px;
          border-radius: 50%;
          background: var(--ft-accent);
          opacity: 0.8;
          filter: drop-shadow(0 0 4px var(--ft-accent));
          animation: ftFlow ${Math.max(steps.length * 1.1, 2.2)}s linear infinite;
        }
        @keyframes ftFlow {
          0% { top: 0%; opacity: 0; }
          8% { opacity: 0.9; }
          92% { opacity: 0.9; }
          100% { top: 100%; opacity: 0; }
        }
        .ft-node {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8;
          transition: transform .25s ease, background .25s ease, border-color .25s ease, color .25s ease;
        }
        .ft-node:hover {
          border-color: var(--ft-accent);
        }
        .ft-node.active {
          background: var(--ft-accent);
          border-color: var(--ft-accent);
          color: #0b0b0f;
          transform: scale(1.2);
          box-shadow: 0 0 16px var(--ft-accent);
        }
        .ft-node.active::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid var(--ft-accent);
          animation: ftPulse 1.8s ease-out infinite;
          pointer-events: none;
        }
        @keyframes ftPulse {
          0% { transform: scale(0.85); opacity: 0.55; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .ft-label {
          position: absolute;
          right: 44px;
          top: 50%;
          transform: translateY(-50%) translateX(4px);
          white-space: nowrap;
          font-size: 12px;
          font-weight: 600;
          color: #e2e8f0;
          background: rgba(12,12,16,0.9);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 4px 10px;
          border-radius: 6px;
          opacity: 0;
          pointer-events: none;
          transition: opacity .18s ease, transform .18s ease;
        }
        .ft-node:hover .ft-label,
        .ft-node.active .ft-label {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
      `}</style>
      <div className="ft-track">
        <div className="ft-line" />
        <div className="ft-line-fill" />
        <div className="ft-dot" />
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={`ft-node${i === active ? ' active' : ''}`}
            onClick={() => headingsRef.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          >
            <span>{s.icon}</span>
            <span className="ft-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
