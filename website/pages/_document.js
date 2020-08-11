import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { SkipNavLink } from '@reach/skip-nav';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <SkipNavLink />
        <body>
          <Main />
          <NextScript />
          <script
            src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
            async
            defer
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
