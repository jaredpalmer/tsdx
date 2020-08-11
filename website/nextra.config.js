import React from 'react';
import { Logo } from 'components/logo';

export default {
  github: 'https://github.com/formium/tsdx',
  titleSuffix: ' – TSDX',
  logo: (
    <>
      <Logo height={36} />
      <span className=" font-extrabold hidden md:inline sr-only">TSDX</span>
    </>
  ),
  head: () => (
    <>
      {/* Favicons, meta */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />

      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta
        name="description"
        content="Build production ready TypeScript packages. The world's leading companies use TSDX to build and test TypeScript packages"
      />
      <meta
        name="og:description"
        content="Build production ready TypeScript packages. The world's leading companies use TSDX to build and test TypeScript packages"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@jaredpalmer" />
      <meta name="twitter:image" content="https://tsdx.io/og_image.jpg" />
      <meta
        name="og:title"
        content="TSDX: Modern TypeScript Package Development"
      />
      <meta name="og:url" content="https://tsdx.io" />
      <meta name="og:image" content="https://tsdx.io/og_image.jpg" />
      <meta name="apple-mobile-web-app-title" content="TSDX" />
      {/* <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        media="print"
        onload="this.media='all'"
      /> */}
    </>
  ),
  footer: ({ filepath }) => (
    <>
      <div className="mt-24 flex justify-between flex-col-reverse md:flex-row items-center md:items-end">
        <a
          href="https://jaredpalmer.com/?utm_source=tsdx"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center no-underline text-current font-semibold"
        >
          <span className="mr-1">A Jared Palmer Project</span>
        </a>
        <div className="mt-6" />
        <a
          className="text-sm"
          href={
            'https://github.com/formium/tsdx/tree/master/website/pages' +
            filepath
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          Edit this page on GitHub
        </a>
      </div>
    </>
  ),
};
