/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'TSDX',
  tagline: 'Zero-config TypeScript package development',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'palmerhq', // Usually your GitHub org/user name.
  projectName: 'tsdx', // Usually your repo name.
  themeConfig: {
    navbar: {
      // title: 'My Site',
      logo: {
        alt: 'TSDX Logo',
        src: 'img/logo.svg',
      },
      links: [
        { to: 'docs/get-started', label: 'Docs', position: 'right' },
        { to: 'help', label: 'Help', position: 'right' },
        { to: 'users', label: 'Users', position: 'right' },
        // { to: 'blog', label: 'Blog', position: 'right' },
        {
          href: 'https://github.com/palmerhq/tsdx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/get-started',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //   ],
        // },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
          ],
        },
      ],

      copyright: `Copyright © ${new Date().getFullYear()} The Palmer Group. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
