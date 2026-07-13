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
│   ├── species/                     # Supported Species browser
│   │   ├── index.astro              #   species grid
│   │   └── [slug].astro             #   stages, cultivar attrs, care, feeding
│   └── vendors/index.astro          # Vendor catalogue
├── content/docs/
│   ├── getting-started/             # Starlight — Getting Started section
│   └── documentation/               # Starlight — Documentation section
├── components/                      # SiteHeader, SiteFooter, Logo, LucideIcon, ...
│   └── starlight/SiteTitle.astro    # header nav override for docs pages
├── layouts/SiteLayout.astro         # shell for the custom pages
├── lib/                             # build-time readers (no separate generate step)
│   ├── catalog-paths.ts             #   resolves the catalog root (growrig-catalog)
│   ├── devices.ts                   #   reads devices/<category>/<slug>/device.yaml
│   ├── vendors.ts                   #   reads vendors/<id>/vendor.yaml
│   ├── inventory.ts                 #   reads inventory/<category>/{inventory,products}.yaml
│   ├── integrations.ts              #   reads integrations/<category>/<id>/integration.yaml
│   └── species.ts                   #   reads species/<id>/{species,feedings}.yaml
└── styles/                          # site.css (custom pages) + custom.css (docs)
```

## Generated catalogs

The **Devices**, **Products**, **Integrations**, **Species**, and **Vendors**
browsers are all generated at build time from the default content catalog,
[`growrig-catalog`](https://github.com/growrig/growrig-catalog) — there is **no
separate generate step**. `src/lib/catalog-paths.ts` resolves the catalog root,
preferring, in order: a sibling `../growrig-catalog` checkout, the platform's
`../growrig/catalog` submodule, and a bundled snapshot in
`source/growrig-catalog/` (used by CI). The pre-split `growrig` platform layout
is kept as a last-resort fallback.

```text
devices/<category>/<slug>/device.yaml          (+ optional guide.md)   → /devices
inventory/<category>/{inventory,products}.yaml                         → /products
integrations/<category>/<id>/integration.yaml  (+ README.md, icon.svg) → /integrations
species/<id>/{species,feedings}.yaml                                   → /species
vendors/<id>/vendor.yaml                                               → /vendors
```

Override the whole catalog root with `GROWRIG_CATALOG_DIR`, or a single
directory with `GROWRIG_DEVICES_DIR`, `GROWRIG_INVENTORY_DIR`,
`GROWRIG_INTEGRATIONS_DIR`, `GROWRIG_SPECIES_DIR`, or `GROWRIG_VENDORS_DIR`.
During `npm run dev`, changes under the catalog's `devices`, `vendors`,
`inventory`, `integrations`, and `species` directories trigger an automatic reload.

These are only the built-in defaults: a GrowRig installation can add any public
repository with a compatible `catalog.yaml` manifest as an extra catalog source
(**Control panel → Catalogs**), so growers can maintain their own devices,
integrations or species without forking. To contribute to the official catalog,
see the docs: [Adding a device](https://growrig.dev/docs/adding-a-device/),
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

The GitHub Actions workflow checks out this repo and the `growrig-catalog`
content catalog into `source/growrig-catalog/`, installs dependencies, runs
`npm run check`, builds the site, and deploys `dist/` to GitHub Pages on pushes
to `main`. The custom domain is configured via `public/CNAME`.
