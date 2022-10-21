// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

lightCodeTheme.plain.backgroundColor = '#F6F7F8';
darkCodeTheme.plain.backgroundColor = '#323234';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Purplet',
  tagline: 'A simple framework to build modern Discord apps.',
  url: 'https://purplet.js.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'CRBT-Team', // Usually your GitHub org/user name.
  projectName: 'Purplet', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/CRBT-Team/Purplet/tree/main/sites/purplet.js.org/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/CRBT-Team/Purplet/tree/main/sites/purplet.js.org/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Purplet',
        logo: {
          alt: 'Purplet Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/CRBT-Team/Purplet',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/BFkHA8P7rh',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} CRBT Team`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
