---
title: Adding an integration
description: Contribute an external-service integration bundle to the GrowRig supported-integrations catalog.
sidebar:
  order: 13
---

The [supported-integrations catalog](/integrations/) is generated directly from
bundle definitions in the [`growrig-catalog`](https://github.com/growrig/growrig-catalog)
repository. A **bundle** describes an external
service GrowRig can connect to — its capabilities, its config fields, and how it
runs. See [External integrations](/docs/integrations/) for the full model
(bundles, instances, capabilities, bindings).

Many integrations need **no Grow Core code at all** — an `http` runtime is
defined entirely in YAML.

## Define the bundle

A bundle lives at:

```text
growrig-catalog/integrations/<category>/<id>/integration.yaml
```

The **path** supplies the category (`ai`, `data`, `notification`) and the bundle
id. Alongside it you may place a `README.md` (rendered on the integration page)
and an `icon.svg`.

```yaml
id: notification-webhook
name: Notification webhook
version: "1.0.0"
category: notification
description: Send GrowRig notifications to any HTTP webhook.
capabilities:
  - notification.send
documentation: README.md
config:
  - { key: endpoint,      label: Webhook URL, type: url,      required: true }
  - { key: authorization, label: Auth token,  type: password, secret: true }
runtime:
  type: http
  test:
    urlField: endpoint
    method: POST
    body: { event: growrig.integration.test }
  operations:
    notification.send:
      urlField: endpoint
      method: POST
      body:
        title: "{{input.title}}"
        message: "{{input.message}}"
```

## Fields

- **`capabilities`** — the typed `domain.action` capabilities this bundle
  provides (e.g. `ai.chat`, `weather.forecast`, `notification.send`). Features
  bind to capabilities, not to your bundle by name.
- **`config`** — the fields a user fills in per instance. Mark credentials
  `secret: true`; they are AES-GCM encrypted at rest and never returned by the
  API.
- **`runtime.type`**:
  - **`http`** — declare the request(s) for `test` and each operation, using
    `{{config.*}}` and `{{input.*}}` templating. No Grow Core code needed.
  - **`builtin`** — for services that need native handling. Set
    `handler: <name>` and implement the runtime in
    `growcore/internal/integrations`.

## Icon & docs

Place an `icon.svg` beside the YAML for the catalog card and detail page, and a
`README.md` (referenced by `documentation:`) for a longer description — its
leading `# H1` is dropped in favour of the page title.

## Verify

Both Grow Core and this docs site read the same tree, so a new bundle appears in
its category automatically:

```bash
npm run dev
```

There is no separate generation step — the site reads the integration
definitions directly at build time from the sibling `growrig-catalog`
repository (falling back to the bundled snapshot in `source/`).
