import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'TSDX',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/jaredpalmer/tsdx',
        external: true,
      },
    ],
  };
}
