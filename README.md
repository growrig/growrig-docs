# GrowRig Docs MVP

A working documentation-site starter for the GrowRig ecosystem.

It uses Astro Starlight for hand-written documentation and generates reference pages from two authoritative sources:

- project documentation from [`growrig/growrig`](https://github.com/growrig/growrig);
- device definitions from [`growrig/growrig-platform/devices`](https://github.com/growrig/growrig-platform/tree/main/devices).

## What is included

- GrowRig-themed Starlight landing page and navigation;
- imported concept, architecture, terminology, prototype, safety, roadmap, and ADR pages;
- generated device catalog, category indexes, and individual device pages;
- validation for the current `device.yaml` shape;
- optional `guide.md` content beside each device definition;
- GitHub Actions build and GitHub Pages deployment;
- bundled source snapshots so the MVP can be demonstrated without cloning sibling repositories.

## Recommended repository layout

```text
workspace/
├── growrig/
├── growrig-platform/
└── growrig-docs/
```

The generators prefer those sibling repositories. If they are not present, they use the bundled `source/` snapshots.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open the local URL printed by Astro.

Useful commands:

```bash
npm run generate        # refresh project and device reference pages
npm run test:generated  # smoke-test generated output
npm run check           # Astro and TypeScript checks
npm run build           # production build
npm run preview         # preview the production build
```

## Explicit source paths

```bash
GROWRIG_SOURCE_DIR=/path/to/growrig \
GROWRIG_DEVICES_DIR=/path/to/growrig-platform/devices \
npm run dev
```

Set `SITE_URL` when publishing somewhere other than `https://docs.growrig.org`.

## Device definition workflow

A device is discovered at:

```text
devices/<category>/<slug>/device.yaml
```

The path supplies the category and slug. The YAML supplies metadata and capabilities. Add an optional `guide.md` in the same directory for setup instructions, limitations, and troubleshooting.

The generator writes to `src/content/docs/devices/catalog/`. Generated files are ignored by Git because they are recreated during every build.

## Project documentation workflow

Markdown under `growrig/docs/` is copied into `src/content/docs/project/reference/`. The generator also imports selected root files such as `ROADMAP.md`, `CONTRIBUTING.md`, and `GOVERNANCE.md` when present.

Edit those documents in the main GrowRig repository, not in the generated output.

## Deployment

The included workflow:

1. checks out this docs repository;
2. checks out the current `growrig` and `growrig-platform` repositories into `source/`;
3. installs dependencies;
4. regenerates all reference pages;
5. runs the smoke test and Astro checks;
6. builds and deploys `dist/` to GitHub Pages on pushes to `main`.

For a custom domain, add the DNS record and configure the domain in the repository's GitHub Pages settings. Update `SITE_URL` in the workflow environment.

## Next useful improvements

The MVP intentionally avoids a complex custom content loader. Later additions can include device images, structured support status, compatibility-test results, schema sharing with Grow Core, rendered Mermaid diagrams, versioned documentation, and localization.
