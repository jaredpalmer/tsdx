import Link from 'next/link';

const features = [
  {
    title: 'Zero Config',
    description: 'Sensible defaults, just start coding. No complex setup required.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1={12} y1={19} x2={20} y2={19} />
      </svg>
    ),
  },
  {
    title: 'Modern Tooling',
    description: 'Built on bunchee, vitest, oxlint, and oxfmt for blazing fast development.',
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
      </svg>
    ),
  },
  {
    title: 'Dual ESM/CJS',
    description: 'Automatic dual module builds with proper exports configuration.',
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"></path>
      </svg>
    ),
  },
  {
    title: 'TypeScript First',
    description: 'Full TypeScript support with automatic declaration generation.',
    icon: (
      <svg fill="none" height="24" viewBox="0 0 27 26" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          clipRule="evenodd"
          d="m.98608 0h24.32332c.5446 0 .9861.436522.9861.975v24.05c0 .5385-.4415.975-.9861.975h-24.32332c-.544597 0-.98608-.4365-.98608-.975v-24.05c0-.538478.441483-.975.98608-.975zm13.63142 13.8324v-2.1324h-9.35841v2.1324h3.34111v9.4946h2.6598v-9.4946zm1.0604 9.2439c.4289.2162.9362.3784 1.5218.4865.5857.1081 1.2029.1622 1.8518.1622.6324 0 1.2331-.0595 1.8023-.1784.5691-.1189 1.0681-.3149 1.497-.5879s.7685-.6297 1.0187-1.0703.3753-.9852.3753-1.6339c0-.4703-.0715-.8824-.2145-1.2365-.1429-.3541-.3491-.669-.6186-.9447-.2694-.2757-.5925-.523-.9692-.7419s-.8014-.4257-1.2743-.6203c-.3465-.1406-.6572-.2771-.9321-.4095-.275-.1324-.5087-.2676-.7011-.4054-.1925-.1379-.3409-.2838-.4454-.4379-.1045-.154-.1567-.3284-.1567-.523 0-.1784.0467-.3392.1402-.4824.0935-.1433.2254-.2663.3959-.369s.3794-.1824.6269-.2392c.2474-.0567.5224-.0851.8248-.0851.22 0 .4523.0162.697.0486.2447.0325.4908.0825.7382.15.2475.0676.4881.1527.7218.2555.2337.1027.4495.2216.6475.3567v-2.4244c-.4015-.1514-.84-.2636-1.3157-.3365-.4756-.073-1.0214-.1095-1.6373-.1095-.6268 0-1.2207.0662-1.7816.1987-.5609.1324-1.0544.3392-1.4806.6203s-.763.6392-1.0104 1.0743c-.2475.4352-.3712.9555-.3712 1.5609 0 .7731.2268 1.4326.6805 1.9785.4537.546 1.1424 1.0082 2.0662 1.3866.363.146.7011.2892 1.0146.4298.3134.1405.5842.2865.8124.4378.2282.1514.4083.3162.5403.4946s.198.3811.198.6082c0 .1676-.0413.323-.1238.4662-.0825.1433-.2076.2676-.3753.373s-.3766.1879-.6268.2473c-.2502.0595-.5431.0892-.8785.0892-.5719 0-1.1383-.0986-1.6992-.2959-.5608-.1973-1.0805-.4933-1.5589-.8879z"
          fill="currentColor"
          fillRule="evenodd"
        ></path>
      </svg>
    ),
  },
  {
    title: 'Lightning Fast',
    description: 'Rust-powered linting (50-100x faster) and formatting (35x faster).',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
  {
    title: 'Bun Native',
    description: 'Uses bun for package management with native speed.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1={12} y1={18} x2={12} y2={12} />
        <line x1={9} y1={15} x2={15} y2={15} />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center bg-gradient-to-b from-fd-background to-fd-secondary/20">
        <div className="max-w-4xl mx-auto">
          {/* Logo - Light mode */}
          <div className="flex justify-center mb-8">
            <svg
              height={80}
              viewBox="0 0 441 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="dark:hidden"
            >
              <path d="M0 127V254H127H254V127V8.28505e-06H127H0V127Z" fill="#007ACC" />
              <path
                d="M56.0802 127.508L56 137.925H72.4369H88.8739L88.8739 184.962V232H100.5H112.126V184.962L112.126 137.925H128.563H145V127.71C145 122.057 144.88 117.333 144.719 117.212C144.599 117.051 124.594 116.97 100.34 117.01L56.2004 117.131L56.0802 127.508Z"
                fill="white"
              />
              <path
                d="M204.89 117.051C211.339 118.673 216.256 121.551 220.77 126.254C223.107 128.768 226.573 133.349 226.855 134.444C226.936 134.768 215.893 142.228 209.203 146.403C208.961 146.566 207.994 145.512 206.905 143.89C203.641 139.106 200.215 137.038 194.976 136.673C187.278 136.146 182.32 140.201 182.361 146.971C182.361 148.958 182.643 150.133 183.449 151.755C185.142 155.282 188.285 157.39 198.16 161.688C216.336 169.553 224.115 174.742 228.951 182.121C234.352 190.351 235.561 203.486 231.893 213.257C227.863 223.879 217.868 231.095 203.802 233.487C199.449 234.257 189.132 234.136 184.457 233.284C174.26 231.46 164.587 226.392 158.622 219.744C156.285 217.149 151.73 210.378 152.013 209.892C152.133 209.73 153.181 209.081 154.35 208.392C155.479 207.743 159.751 205.27 163.781 202.919L171.076 198.662L172.607 200.932C174.744 204.216 179.419 208.716 182.24 210.216C190.341 214.514 201.464 213.905 206.946 208.959C209.283 206.811 210.251 204.581 210.251 201.297C210.251 198.337 209.888 197.04 208.356 194.81C206.381 191.972 202.351 189.58 190.905 184.594C177.807 178.918 172.164 175.391 167.005 169.796C164.023 166.553 161.202 161.363 160.033 157.025C159.066 153.417 158.824 144.376 159.59 140.728C162.29 127.998 171.842 119.119 185.625 116.484C190.099 115.632 200.497 115.957 204.89 117.051Z"
                fill="white"
              />
              <path
                d="M305.321 211.872C301.475 211.872 298.425 208.551 298.425 200.183C298.425 186.767 306.648 169.233 315.269 169.233C317.656 169.233 321.767 169.897 326.277 171.358L320.043 203.769C314.871 208.419 309.168 211.872 305.321 211.872ZM350.945 222.1L349.487 212.271C338.478 214.662 337.948 214.529 339.009 208.817L355.19 125L335.03 126.461L329.99 152.629C328.133 152.363 326.409 152.363 324.818 152.363C295.64 152.363 278 179.86 278 206.293C278 222.897 285.295 231 294.048 231C301.74 231 310.892 224.757 318.849 216.92C318.186 231.797 325.481 236.446 350.945 222.1Z"
                fill="black"
              />
              <path
                d="M404.129 229.406L426.941 228.742L409.965 191.815L441 154.356H419.514L400.548 179.727L390.071 154.09L367.259 154.887L383.97 191.682L352.935 229.14H374.553L393.519 203.769L404.129 229.406Z"
                fill="black"
              />
            </svg>
            {/* Logo - Dark mode */}
            <svg
              height={80}
              viewBox="0 0 441 254"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hidden dark:block"
            >
              <path d="M0 127V254H127H254V127V8.28505e-06H127H0V127Z" fill="#007ACC" />
              <path
                d="M56.0802 127.508L56 137.925H72.4369H88.8739L88.8739 184.962V232H100.5H112.126V184.962L112.126 137.925H128.563H145V127.71C145 122.057 144.88 117.333 144.719 117.212C144.599 117.051 124.594 116.97 100.34 117.01L56.2004 117.131L56.0802 127.508Z"
                fill="white"
              />
              <path
                d="M204.89 117.051C211.339 118.673 216.256 121.551 220.77 126.254C223.107 128.768 226.573 133.349 226.855 134.444C226.936 134.768 215.893 142.228 209.203 146.403C208.961 146.566 207.994 145.512 206.905 143.89C203.641 139.106 200.215 137.038 194.976 136.673C187.278 136.146 182.32 140.201 182.361 146.971C182.361 148.958 182.643 150.133 183.449 151.755C185.142 155.282 188.285 157.39 198.16 161.688C216.336 169.553 224.115 174.742 228.951 182.121C234.352 190.351 235.561 203.486 231.893 213.257C227.863 223.879 217.868 231.095 203.802 233.487C199.449 234.257 189.132 234.136 184.457 233.284C174.26 231.46 164.587 226.392 158.622 219.744C156.285 217.149 151.73 210.378 152.013 209.892C152.133 209.73 153.181 209.081 154.35 208.392C155.479 207.743 159.751 205.27 163.781 202.919L171.076 198.662L172.607 200.932C174.744 204.216 179.419 208.716 182.24 210.216C190.341 214.514 201.464 213.905 206.946 208.959C209.283 206.811 210.251 204.581 210.251 201.297C210.251 198.337 209.888 197.04 208.356 194.81C206.381 191.972 202.351 189.58 190.905 184.594C177.807 178.918 172.164 175.391 167.005 169.796C164.023 166.553 161.202 161.363 160.033 157.025C159.066 153.417 158.824 144.376 159.59 140.728C162.29 127.998 171.842 119.119 185.625 116.484C190.099 115.632 200.497 115.957 204.89 117.051Z"
                fill="white"
              />
              <path
                d="M305.321 211.872C301.475 211.872 298.425 208.551 298.425 200.183C298.425 186.767 306.648 169.233 315.269 169.233C317.656 169.233 321.767 169.897 326.277 171.358L320.043 203.769C314.871 208.419 309.168 211.872 305.321 211.872ZM350.945 222.1L349.487 212.271C338.478 214.662 337.948 214.529 339.009 208.817L355.19 125L335.03 126.461L329.99 152.629C328.133 152.363 326.409 152.363 324.818 152.363C295.64 152.363 278 179.86 278 206.293C278 222.897 285.295 231 294.048 231C301.74 231 310.892 224.757 318.849 216.92C318.186 231.797 325.481 236.446 350.945 222.1Z"
                fill="white"
              />
              <path
                d="M404.129 229.406L426.941 228.742L409.965 191.815L441 154.356H419.514L400.548 179.727L390.071 154.09L367.259 154.887L383.97 191.682L352.935 229.14H374.553L393.519 203.769L404.129 229.406Z"
                fill="white"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-fd-foreground mb-4">
            Zero-config TypeScript Package Development
          </h1>

          <p className="mt-6 text-lg leading-8 text-fd-muted-foreground max-w-2xl mx-auto">
            TSDX helps you develop, test, and publish modern TypeScript packages with ease.
            Built on modern, high-performance Rust-based tooling.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/docs"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/jaredpalmer/tsdx"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-fd-border px-6 py-3 text-sm font-semibold text-fd-foreground hover:bg-fd-secondary transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          </div>

          {/* Quick Install */}
          <div className="mt-12 flex justify-center">
            <div className="relative">
              <pre className="rounded-lg bg-fd-secondary px-6 py-4 text-sm text-fd-foreground font-mono">
                bunx tsdx create mylib
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl">
              Everything you need to build TypeScript packages
            </h2>
            <p className="mt-4 text-lg text-fd-muted-foreground">
              Modern tooling. Zero configuration. Maximum productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 rounded-xl border border-fd-border bg-fd-card hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-fd-foreground mb-2">{feature.title}</h3>
                <p className="text-fd-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Stack Section */}
      <section className="py-24 px-6 bg-fd-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-fd-foreground sm:text-4xl mb-8">
            Powered by Modern Tools
          </h2>
          <p className="text-lg text-fd-muted-foreground mb-12">
            TSDX 2.0 is built on the fastest, most modern tools in the ecosystem.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'bunchee', description: 'Bundling', url: 'https://github.com/huozhi/bunchee' },
              { name: 'vitest', description: 'Testing', url: 'https://vitest.dev/' },
              { name: 'oxlint', description: 'Linting', url: 'https://oxc.rs/' },
              { name: 'bun', description: 'Package Mgmt', url: 'https://bun.sh/' },
            ].map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-fd-border bg-fd-card hover:border-primary/50 transition-colors"
              >
                <div className="font-semibold text-fd-foreground">{tool.name}</div>
                <div className="text-sm text-fd-muted-foreground">{tool.description}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-fd-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-fd-muted-foreground">
            <span>A</span>
            <a
              href="https://jaredpalmer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-fd-foreground hover:text-primary transition-colors"
            >
              Jared Palmer
            </a>
            <span>Project</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/jaredpalmer/tsdx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/jaredpalmer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
