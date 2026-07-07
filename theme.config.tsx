import React from 'react'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

// Azure-branded SVG logo
const AzureLogo = () => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simplified Azure-style cloud icon */}
      <path
        d="M13.05 4.24L7.27 17.67H2L7.53 8.06L13.05 4.24Z"
        fill="#0078D4"
      />
      <path
        d="M13.74 5.19L17.65 16.25L22 17.67H9.73L13.74 5.19Z"
        fill="#0050A0"
      />
    </svg>
    <span
      style={{
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: '-0.01em',
      }}
    >
      Azure AI Docs
    </span>
  </span>
)

const config: DocsThemeConfig = {
  // ─── Branding ───────────────────────────────────────────────────────────────
  logo: <AzureLogo />,

  // Primary hue set to Azure blue (210°)
  primaryHue: 210,
  primarySaturation: 85,

  // ─── Repository links ───────────────────────────────────────────────────────
  project: {
    link: 'https://github.com/vijay-anand-code/azure-ai-knowledge-base',
  },
  // Removes the Discord chat icon — not needed for internal docs
  // chat: { link: '...' },

  docsRepositoryBase:
    'https://github.com/vijay-anand-code/azure-ai-knowledge-base/blob/main',

  // ─── SEO / page titles ──────────────────────────────────────────────────────
  useNextSeoProps() {
    const { asPath } = useRouter()
    // Home page: just the site name; all other pages: "Page – Azure AI Docs"
    if (asPath === '/') {
      return { titleTemplate: 'Azure AI Knowledge Base' }
    }
    return { titleTemplate: '%s – Azure AI Docs' }
  },

  // ─── Head tags (favicon, OG meta) ───────────────────────────────────────────
  head: () => {
    const { asPath } = useRouter()
    const { frontMatter } = useConfig()
    const url = `https://docs-lovat-ten.vercel.app${asPath}`
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content={frontMatter.title ?? 'Azure AI Knowledge Base'}
        />
        <meta
          property="og:description"
          content={
            frontMatter.description ??
            'Engineering handbooks, runbooks, and reference material for Azure AI.'
          }
        />
        {/* Use /favicon.ico in your /public folder */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </>
    )
  },

  // ─── Search ─────────────────────────────────────────────────────────────────
  // Nextra uses Flexsearch out of the box — no extra config needed.
  // To customise the placeholder text shown in the search bar:
  search: {
    placeholder: 'Search Azure docs…',
  },

  // ─── Top navigation bar ─────────────────────────────────────────────────────
  navbar: {
    extraContent: (
      <a
        href="https://portal.azure.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '13px',
          color: 'var(--nextra-colors-gray-500)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '6px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e =>
          (e.currentTarget.style.background = 'var(--nextra-colors-gray-100)')
        }
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        Azure Portal ↗
      </a>
    ),
  },

  // ─── Sidebar ────────────────────────────────────────────────────────────────
  sidebar: {
    // Only top-level folders are expanded by default — cleaner for large docs
    defaultMenuCollapseLevel: 1,
    // Auto-collapse other sections when you open a new one
    autoCollapse: true,
    toggleButton: true,
  },

  // ─── Table of contents (right rail) ─────────────────────────────────────────
  toc: {
    backToTop: true,
    title: 'On this page',
    float: true,
  },

  // ─── In-page navigation arrows ──────────────────────────────────────────────
  navigation: {
    prev: true,
    next: true,
  },

  // ─── Dark / light mode toggle ────────────────────────────────────────────────
  // Nextra handles this automatically — the toggle appears in the navbar.
  // Set the default theme here: 'light' | 'dark' | 'system'
  darkMode: true,
  // nextThemes lets you control the default and storage key
  nextThemes: {
    defaultTheme: 'system', // respects user OS preference
    storageKey: 'azure-docs-theme',
  },

  // ─── Edit this page link ────────────────────────────────────────────────────
  editLink: {
    text: 'Edit this page on GitHub →',
  },

  // ─── Feedback widget (thumbs up/down) ───────────────────────────────────────
  // Remove this block if you don't want the feedback prompt
  feedback: {
    content: 'Was this page helpful? →',
    labels: 'feedback',
  },

  // ─── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    text: (
      <span style={{ fontSize: '13px', color: 'var(--nextra-colors-gray-500)' }}>
        © {new Date().getFullYear()} Azure AI Team · Internal use only
      </span>
    ),
  },

  // ─── 404 page ───────────────────────────────────────────────────────────────
  notFound: {
    content: 'Submit an issue about missing page →',
    labels: 'bug',
  },
}

export default config
