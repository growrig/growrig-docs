import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = process.env.SITE_URL ?? 'https://growrig.dev';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'GrowRig',
      description: 'Open, local-first monitoring and automation for controlled indoor growing.',
      logo: {
        src: './src/assets/growrig-logo.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GrowRig on GitHub',
          href: 'https://github.com/growrig',
        },
      ],
      lastUpdated: true,
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Overview', slug: 'getting-started' },
            { label: 'Project documentation', slug: 'project' },
            { label: 'Supported devices', slug: 'devices' },
          ],
        },
        {
          label: 'Project',
          items: [{ autogenerate: { directory: 'project/reference' } }],
        },
        {
          label: 'Device catalog',
          items: [{ autogenerate: { directory: 'devices/catalog' } }],
        },
        {
          label: 'Contributing',
          items: [{ autogenerate: { directory: 'contributing' } }],
        },
      ],
    }),
  ],
});
