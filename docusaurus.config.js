const path = require('path');

// const math = require('remark-math');
// const katex = require('rehype-katex');
/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Lido for Solana',
  tagline: 'Awesome liquid staking on Solana, the high-performance, permissionless blockchain',
  url: 'https://docs.solana.lido.fi/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/stSOL.svg',
  organizationName: 'Lido',
  projectName: 'solido',
  i18n: {
    defaultLocale: 'en',
    locales: [ 'en'],
  },
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig: {
    navbar: {
      title: 'Lido for Solana',
      logo: {
        alt: 'Lido for Solana Logo',
        src: 'img/stSOL.svg',
        srcDark: 'img/stSOL.svg',
      },
      items: [
        {
          href: 'https://medium.com/chorus-one/introducing-lido-for-solana-8aa02db8503',
          label: 'Blog',
          position: 'right',
        },
        {
          href: 'https://github.com/lidofinance/solido-sdk',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // remarkPlugins: [math],
          // rehypePlugins: [katex],
        },
      },
    ],
  ],
  // plugins: [
  //   [
  //     'docusaurus-plugin-module-alias',
  //     {
  //       alias: {
  //         '@/api': path.resolve(__dirname, '../src/api'),
  //       },
  //     },
  //   ],
  // ]
};
