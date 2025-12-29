import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | TSDX',
    default: 'TSDX - Zero-config TypeScript Package Development',
  },
  description:
    'Zero-config CLI for TypeScript package development. Build production-ready TypeScript packages with modern tooling.',
  metadataBase: new URL('https://tsdx.io'),
  openGraph: {
    title: 'TSDX - Zero-config TypeScript Package Development',
    description:
      'Zero-config CLI for TypeScript package development. Build production-ready TypeScript packages with modern tooling.',
    url: 'https://tsdx.io',
    siteName: 'TSDX',
    images: [
      {
        url: '/og_image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TSDX - Zero-config TypeScript Package Development',
    description:
      'Zero-config CLI for TypeScript package development. Build production-ready TypeScript packages with modern tooling.',
    images: ['/og_image.jpg'],
    creator: '@jaredpalmer',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
