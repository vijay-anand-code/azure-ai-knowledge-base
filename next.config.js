const nextra = require('nextra')
const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true,
})
module.exports = withNextra({
  reactStrictMode: true,
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: '/source-code',
        destination: '/azure-secret-governance/source-code',
        permanent: true,
      },
      {
        source: '/source-code/:path*',
        destination: '/azure-secret-governance/source-code/:path*',
        permanent: true,
      },
    ]
  },
})
