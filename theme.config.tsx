import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const AzureLogo = () => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13.05 4.24L7.27 17.67H2L7.53 8.06L13.05 4.24Z" fill="#0078D4" />
      <path d="M13.74 5.19L17.65 16.25L22 17.67H9.73L13.74 5.19Z" fill="#0050A0" />
    </svg>
    Azure AI Docs
  </span>
)

const config: DocsThemeConfig = {
  logo: <AzureLogo />,
  primaryHue: 210,
  primarySaturation: 85,

  project: {
    link: 'https://github.com/vijay-anand-code/azure-ai-knowledge-base',
  },
  docsRepositoryBase:
    'https://github.com/vijay-anand-code/azure-ai-knowledge-base/blob/main',

  search: {
    placeholder: 'Search Azure docs…',
  },

  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },

  toc: {
    backToTop: true,
    title: 'On this page',
  },

  navigation: { prev: true, next: true },
  darkMode: true,

  editLink: {
    text: 'Edit this page on GitHub →',
  },

  footer: {
    text: `© ${new Date().getFullYear()} Azure AI Team · Internal use only`,
  },
}

export default config
