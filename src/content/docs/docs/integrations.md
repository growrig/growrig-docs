---
title: External integrations
description: How GrowRig connects to outside services — bundles, configured instances, capabilities, and feature bindings.
sidebar:
  order: 7
---

Some GrowRig features rely on services that live outside the grow: an AI model,
a weather provider, a notification channel. These are **external integrations** —
kept deliberately separate from [devices](/docs/device-model/) and from the
[Home Assistant](/docs/home-assistant/) adapter, because they are services, not
physical equipment on the control loop.

The full catalog is browsable at **[Supported integrations](/integrations/)**,
generated from the same definitions Grow Core loads.

## Bundles

A **bundle** is a reusable integration definition, shipped as YAML in the
platform repository (`integrations/<category>/<id>/integration.yaml`). It
declares the integration's identity, the **capabilities** it provides, the
**config fields** a user fills in, and how it runs:

```yaml
id: ollama
name: Ollama
category: ai
capabilities:
  - ai.chat
  - ai.vision
  - ai.models
config:
  - { key: baseUrl, label: Server URL, type: url, required: true }
  - { key: apiKey,  label: API key,   type: password, secret: true }
runtime:
  type: builtin
  handler: ollama
```

Fields marked `secret` are treated as credentials (see below). Production builds
embed the whole bundle tree; development loads it directly from disk.

## Capabilities

A **capability** is a typed thing a bundle can do, named in a `domain.action`
form. The seed bundles cover:

| Capability | Meaning |
| --- | --- |
| `ai.chat` | Chat completion |
| `ai.vision` | Vision messages (image payloads) |
| `ai.models` | Model discovery |
| `weather.forecast` | Local weather forecast |
| `notification.send` | Deliver a notification |

Features consume capabilities, not specific vendors — so the [AI
assistant](/docs/ai-assistant/) needs an `ai.chat` provider without caring
whether it's Ollama or another compatible service.

## Instances

An **instance** is a configured copy of a bundle: a name plus the config values
you supplied. You create instances under **Control panel → Integrations**, and
you can have several of one bundle (for example, separate Ollama instances for a
local box and a remote GPU server).

Instances carry a health **status**. A **connection test** exercises the service
(for a built-in runtime it calls the service's own probe; for an HTTP runtime it
posts the bundle's declared test request) and records whether it succeeded.

### Secrets

Config fields marked `secret` are **never stored in the instance config and
never returned by the API**. They are encrypted separately with **AES-GCM**
using a local `0600` key kept beside the Grow Core database. The browser only
ever sees which secret fields are *set*, not their values.

## Runtimes

A bundle declares how it executes:

- **`builtin`** — Grow Core has native code for it (Ollama, Open-Meteo). The
  bundle names a `handler`.
- **`http`** — no custom code. The bundle declares the HTTP request(s) for its
  test and for each capability, with `{{config.*}}` and `{{input.*}}`
  templating. The generic **notification webhook** works this way, so new
  webhook-style integrations need only YAML.

## Bindings

A **binding** selects which instance a feature uses for a capability. Bindings
can be **global** or scoped to a specific grow or environment; a scoped binding
overrides the global one. This is how "use my local Ollama for this grow's
assistant, but the shared one everywhere else" is expressed — the feature
resolves the most specific binding at call time.

```text
Bundle (YAML)  ─ defines ─>  capabilities + config + runtime
      │
Instance      ─ a configured copy, secrets encrypted at rest
      │
Binding       ─ maps a feature+capability to an instance (global or scoped)
      │
Feature       ─ resolves a binding, invokes the capability
```

## Weather: the automatic case

Not every integration needs setup. **Open-Meteo** requires no account or key, so
Grow Core configures it automatically to supply local weather observations and
forecasts (used for outside-conditions context). It's the simplest illustration
of the model: a bundle, an instance, and a `weather.forecast` capability other
features can bind to.
