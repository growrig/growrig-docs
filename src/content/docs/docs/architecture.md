---
title: Architecture
description: How the App, Grow Core, Home Assistant, controllers, and networking fit together.
sidebar:
  order: 3
---

GrowRig separates the user experience, grow-domain logic, device compatibility,
networking, and physical control into distinct roles.

```text
Grow App Web ─┐                    ┌─ Home Assistant ─ third-party devices
              ├─ Grow Core ────────┤
Grow App ─────┘        │           └─ MQTT broker ──── Grow Controller ─ fans / sensors / lights
 (Mobile)              └─ External integrations ─ AI · weather · notifications
```

## Grow Core

Grow Core is the local backend and the source of truth for the grow domain. It is
implemented in **Go**, stores data in **SQLite**, and exposes an **HTTP + WebSocket**
API. It packages as a Home Assistant OS add-on or a Docker container.

At its heart it is a **reconciliation engine**:

```text
actual state + desired targets + active phase + safety constraints
        ↓
desired device state
```

The engine is organised around a pure control law that is independent of any single
adapter, with the grow domain and its supporting catalogs beside it:

```text
growcore/internal/
├── config/       # YAML config: modes, adapters, device topology & entity bindings
├── domain/       # semantic model: environment, device, role — plus grow, plant,
│                 #   cultivar, care, feeding, inventory, integration, ai
├── control/      # pure control law + reconciliation loop + Adapter interface
├── sim/          # simulator adapter
├── ha/           # Home Assistant adapter (WebSocket state + REST commands)
├── catalog/      # device & vendor catalog (devices/ + vendors/)
├── species/      # crop definitions: stages, cultivar attributes, care actions
├── inventory/    # inventory categories + product templates
├── feeding/      # nutrient schedules (feeding recipes)
├── integrations/ # external-service bundles, encrypted secrets, capability runtimes
├── camera/       # camera bindings and snapshot archive
├── store/        # SQLite persistence
├── webui/        # serves the embedded Grow App Web build
└── api/          # HTTP + WebSocket (auth, per-environment access control)
```

Adapters implement the same `Adapter` interface, so the engine and the pure control
law behave identically whether devices are simulated or reached through Home
Assistant. New adapters (for example, direct MQTT) slot in behind the same interface
without touching domain logic.

Two layers sit beside the physical control loop. The **cultivation layer**
([grows &amp; plants](/docs/grows-and-plants/), [inventory](/docs/inventory/)) tracks
what you grow and the supplies you use, independent of any single tent. **External
integrations** ([bundles, instances, bindings](/docs/integrations/)) connect features
like the [AI assistant](/docs/ai-assistant/) to outside services. Both are
deliberately separate from adapters and devices, so a slow or absent AI provider,
weather feed, or notification channel never affects climate control.

Grow Core also **serves the Grow App Web** build directly (the `webui` package), so a
single binary provides the API, the WebSocket, and the dashboard. Access is
**multi-user**: requests are authenticated (password or passkey), an admin role gates
configuration, and list responses are filtered per user with per-environment
read/write checks.

## Home Assistant

Home Assistant remains responsible for device discovery, third-party integrations,
current device state, protocol translation, and generic notifications. Grow Core does
**not** mirror Home Assistant internals into its own domain model — see
[Home Assistant integration](/docs/home-assistant/) and
[data ownership](#data-ownership).

## The apps

**Grow App Web** (SvelteKit) is the primary interface — dashboards, configuration and
role mapping, the grow and plant records, the care journal, inventory, recipe editing,
integrations, historical analysis, and diagnostics. Grow Core serves its build
directly, so there is no separate web server to run. A future **Grow App Mobile**
(Flutter) covers daily status, alerts, pairing, quick overrides, and journal photos.

## Controller connectivity

The prototype supports two paths to a controller.

**Home Assistant path** — the easiest DIY path:

```text
Grow Controller → ESPHome native API → Home Assistant → Grow Core
```

**Direct path** — reduces coupling and keeps working while Home Assistant restarts:

```text
Grow Controller → MQTT → Grow Core
```

ESPHome can expose both. To avoid duplicate ownership, exactly **one adapter is
authoritative for commands**; the other may remain available for visibility or
migration.

## Controller responsibility

The Grow Controller handles the fast, safety-critical loop locally: PWM output,
tachometer measurement, min/max speed, startup boost, command timeout, fallback
state, emergency behavior, physical override, and the last valid policy. Grow Core
sends *intent and policy* — it does not micromanage every PWM edge.

## Data ownership

| Owner | Owns |
| --- | --- |
| **Home Assistant** | Raw entity states, protocol connectivity, discovery, generic history. |
| **Grow Core** | Users & access, semantic roles, environments, grows & plants, cultivars, care journal, inventory, feeding recipes, integration instances & secrets, control policies, cycle history, alerts, diagnostics. |
| **Grow Controller** | Current local outputs, safety state, last accepted policy, offline behavior, hardware health. |
| **External services** | The work behind a bound capability — model inference (AI), weather data, notification delivery. |

## Networking

Grow devices sit behind a **Grow Gateway** on an isolated network. The recommended
default policy denies grow devices access to the home LAN and the internet, allows the
Hub selected outbound services, and allows the home LAN to reach the Grow App / HA UI.
For now the Gateway can be any suitable Wi-Fi router.
