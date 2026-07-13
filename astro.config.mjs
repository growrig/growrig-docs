import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { growrigCatalogSync } from './scripts/vite-growrig-catalog.mjs';
import { resolveCatalogRoot } from './scripts/lib/platform-paths.mjs';

const site = process.env.SITE_URL ?? 'https://growrig.dev';
const base = process.env.BASE_PATH ?? '/';
const catalogRoot = resolveCatalogRoot();

export default defineConfig({
  site,
  base,
  vite: {
    plugins: [growrigCatalogSync()],
    server: {
      fs: {
        allow: catalogRoot ? [process.cwd(), catalogRoot] : undefined,
      },
    },
  },
  integrations: [
    starlight({
      title: 'GrowRig',
      description: 'Open, local-first monitoring and automation for controlled indoor growing.',
      logo: {
        src: './src/assets/growrig-logo.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon-32.png', sizes: '32x32', type: 'image/png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#34b16a' } },
      ],
      components: {
        // Adds top-level product nav (Getting Started / Documentation /
        // Supported Devices) to the docs header.
        SiteTitle: './src/components/starlight/SiteTitle.astro',
      },
      social: [
        {
          icon: 'github',
          label: 'GrowRig on GitHub',
          href: 'https://github.com/growrig',
        },
      ],
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      // Devices live in custom pages under /devices, so no docs entry links
      // there from the sidebar; the header nav covers it.
      sidebar: [
        {
          label: 'Getting Started',
          items: [{ autogenerate: { directory: 'getting-started' } }],
        },
        {
          label: 'Documentation',
          items: [{ autogenerate: { directory: 'docs' } }],
        },
      ],
    }),
  ],
});
