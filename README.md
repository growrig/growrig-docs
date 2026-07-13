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
│   ├── devices/                     # Supported Devices browser
│   │   ├── index.astro              #   category grid + global search
│   │   └── [category]/
│   │       ├── index.astro          #   devices in a category (search + filters)
│   │       └── [slug].astro         #   individual device page
│   ├── products/                    # Supported Products (inventory) browser
│   │   ├── index.astro              #   same shape as devices/
│   │   └── [category]/{index,[slug]}.astro
│   ├── integrations/                # Supported Integrations browser
│   │   ├── index.astro              #   same shape as devices/
│   │   └── [category]/{index,[slug]}.astro
│   └── vendors/index.astro          # Vendor catalogue
├── content/docs/
│   ├── getting-started/             # Starlight — Getting Started section
│   └── documentation/               # Starlight — Documentation section
├── components/                      # SiteHeader, SiteFooter, Logo, LucideIcon, ...
│   └── starlight/SiteTitle.astro    # header nav override for docs pages
├── layouts/SiteLayout.astro         # shell for the custom pages
├── lib/                             # build-time readers (no separate generate step)
│   ├── devices.ts                   #   reads devices/<category>/<slug>/device.yaml
│   ├── vendors.ts                   #   reads vendors/<id>/vendor.yaml
│   ├── inventory.ts                 #   reads inventory/<category>/{inventory,products}.yaml
│   └── integrations.ts              #   reads integrations/<category>/<id>/integration.yaml
└── styles/                          # site.css (custom pages) + custom.css (docs)
```

## Generated catalogs

The **Devices**, **Products**, **Vendors**, and **Integrations** browsers are all
generated at build time from definitions in
[`growrig-platform`](https://github.com/growrig/growrig-platform) — there is **no
separate generate step**. Each `src/lib/*.ts` reader prefers the sibling
`../growrig-platform` directory and falls back to the bundled snapshot in
`source/growrig-platform/` (used by CI).

```text
devices/<category>/<slug>/device.yaml          (+ optional guide.md)   → /devices
inventory/<category>/{inventory,products}.yaml                         → /products
integrations/<category>/<id>/integration.yaml  (+ README.md, icon.svg) → /integrations
vendors/<id>/vendor.yaml                                               → /vendors
```

Override any source location with `GROWRIG_DEVICES_DIR`, `GROWRIG_INVENTORY_DIR`,
`GROWRIG_INTEGRATIONS_DIR`, or `GROWRIG_VENDORS_DIR`. During `npm run dev`, changes
under the platform's `devices`, `vendors`, `inventory`, and `integrations` directories
trigger an automatic reload.

To contribute a definition, see the docs:
[Adding a device](https://growrig.dev/docs/adding-a-device/),
[Adding a product](https://growrig.dev/docs/adding-a-product/), and
[Adding an integration](https://growrig.dev/docs/adding-an-integration/).

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

The GitHub Actions workflow checks out this repo and the `growrig-platform`
`devices/`, `vendors/`, `inventory/`, and `integrations/` catalogs, installs
dependencies, runs `npm run check`, builds the site, and deploys `dist/` to GitHub
Pages on pushes to `main`. The custom domain is configured via `public/CNAME`.
