# GrowRig website & docs

The public website and documentation for the GrowRig ecosystem, published at
[growrig.dev](https://growrig.dev/).

It is an [Astro](https://astro.build/) site that combines:

- a **custom marketing homepage** and a Home-Assistant-style **Supported Devices**
  browser (custom Astro pages under `src/pages/`);
- **Getting Started** and **Documentation** sections built with
  [Astro Starlight](https://starlight.astro.build/) (hand-authored Markdown under
  `src/content/docs/`).

## Structure

```text
src/
├── pages/
│   ├── index.astro                 # Homepage (/)
│   └── devices/                     # Supported Devices browser
│       ├── index.astro              #   category grid + global search
│       └── [category]/
│           ├── index.astro          #   devices in a category (search + filters)
│           └── [slug].astro         #   individual device page
├── content/docs/
│   ├── getting-started/             # Starlight — Getting Started section
│   └── documentation/               # Starlight — Documentation section
├── components/                      # SiteHeader, SiteFooter, Logo, ...
│   └── starlight/SiteTitle.astro    # header nav override for docs pages
├── layouts/SiteLayout.astro         # shell for the custom pages
├── lib/devices.ts                   # reads device.yaml at build time
└── styles/                          # site.css (custom pages) + custom.css (docs)
```

## Supported devices

Device pages are generated at build time from device definitions in
[`growrig-platform`](https://github.com/growrig/growrig-platform):

```text
growrig-platform/devices/<category>/<slug>/device.yaml   (+ optional guide.md)
```

`src/lib/devices.ts` reads these directly — there is **no separate generate step**.
It prefers the sibling `../growrig-platform/devices` directory and falls back to the
bundled snapshot in `source/growrig-platform/devices` (used by CI). Override the
location with `GROWRIG_DEVICES_DIR`.

During `npm run dev`, changes under `../growrig-platform/devices` and
`../growrig-platform/vendors` trigger an automatic reload.

To add a device, see
[Documentation → Adding a device](https://growrig.dev/documentation/adding-a-device/).

## Documentation

The Getting Started and Documentation pages are hand-authored Markdown in this
repository. Edit the files under `src/content/docs/` directly.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev        # start the dev server
npm run check      # Astro + TypeScript checks
npm run build      # production build to dist/
npm run preview    # preview the production build
```

Set `SITE_URL` and `BASE_PATH` when publishing somewhere other than
`https://growrig.dev/`.

## Deployment

The GitHub Actions workflow checks out this repo and the `growrig-platform` device
catalog, installs dependencies, runs `npm run check`, builds the site, and deploys
`dist/` to GitHub Pages on pushes to `main`. The custom domain is configured via
`public/CNAME`.
