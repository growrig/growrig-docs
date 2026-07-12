---
title: Architecture
description: How the App, Grow Core, Home Assistant, controllers, and networking fit together.
sidebar:
  order: 3
---

GrowRig separates the user experience, grow-domain logic, device compatibility,
networking, and physical control into distinct roles.

```text
Flutter App ┐
            ├─ Grow Core ─┬─ Home Assistant ─ third-party devices
SvelteKit ──┘             └─ MQTT broker ──── Grow Controller ─ fans / sensors / lights
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
adapter:

```text
growcore/internal/
├── config/     # YAML config: modes, adapters, device topology & entity bindings
├── domain/     # semantic model: environment, device, channel, role
├── control/    # pure control law + reconciliation loop + Adapter interface
├── sim/        # simulator adapter
├── ha/         # Home Assistant adapter (WebSocket state + REST commands)
├── store/      # SQLite persistence
└── api/        # HTTP + WebSocket
```

Adapters implement the same `Adapter` interface, so the engine and the pure control
law behave identically whether devices are simulated or reached through Home
Assistant. New adapters (for example, direct MQTT) slot in behind the same interface
without touching domain logic.

## Home Assistant

Home Assistant remains responsible for device discovery, third-party integrations,
current device state, protocol translation, and generic notifications. Grow Core does
**not** mirror Home Assistant internals into its own domain model — see
[Home Assistant integration](/documentation/home-assistant/) and
[data ownership](#data-ownership).

## The apps

The **web app** (SvelteKit) is for configuration, role mapping, hardware tests, recipe
editing, historical analysis, diagnostics, and firmware flashing. A future **Flutter
app** covers daily status, alerts, QR pairing, BLE provisioning, quick overrides, and
journal photos.

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
| **Grow Core** | Semantic roles, environments, recipes, control policies, cycle history, alerts, diagnostics. |
| **Grow Controller** | Current local outputs, safety state, last accepted policy, offline behavior, hardware health. |

## Networking

Grow devices sit behind a **Grow Gateway** on an isolated network. The recommended
default policy denies grow devices access to the home LAN and the internet, allows the
Hub selected outbound services, and allows the home LAN to reach the Grow App / HA UI.
For now the Gateway can be any suitable Wi-Fi router.
