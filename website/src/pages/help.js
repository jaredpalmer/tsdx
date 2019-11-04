/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Help() {
  return (
    <Layout permalink="/help" description="Docusaurus 2 Help page">
      <div className="container margin-vert--xl">
        <div className="text--center margin-bottom--xl">
          <h1>Need Help?</h1>
          <p>
            If you need help with TSDX, you can try one of the mechanisms below.
          </p>
        </div>
        <div className="row">
          <div className="col">
            <h2>Browse the docs</h2>
            <p>
              Learn more about Docusaurus using the{' '}
              <Link to={useBaseUrl('docs/get-started')}>
                official documentation.
              </Link>
            </p>
          </div>
          <div className="col">
            <h2>Twitter</h2>
            <p>
              You can follow and contact the maintainers on Twitter{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://twitter.com/jaredpalmer"
              >
                @jaredpalmer
              </a>{' '}
              and{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://twitter.com/swyx"
              >
                @swyx
              </a>
              .
            </p>
          </div>
          <div className="col">
            <h2>GitHub</h2>
            <p>
              At our{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/jaredpalmer/tsdx"
              >
                GitHub repo
              </a>{' '}
              Browse and submit{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/jaredpalmer/tsdx/issues"
              >
                issues
              </a>{' '}
              or{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/jaredpalmer/tsdx/pulls"
              >
                pull requests
              </a>{' '}
              for bugs you find or any new features you may want implemented. Be
              sure to also check out our{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/jaredpalmer/tsdx/blob/master/CONTRIBUTING.md"
              >
                contributing guide
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Help;
