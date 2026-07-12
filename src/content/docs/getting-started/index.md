---
title: Getting started
description: What GrowRig is, how the pieces fit together, and how to run the whole system on your machine with no hardware.
sidebar:
  order: 1
  label: Overview
---

GrowRig is an open-source, **local-first** ecosystem for monitoring and automating
grow tents, boxes, rooms, and other small controlled environments. It combines an
integrated product experience with Home Assistant compatibility, open controller
hardware, local autonomous operation, and replaceable equipment.

You do not need proprietary buses, a mandatory cloud account, or a closed mobile
app. And you can start **today, without any hardware** — the platform ships with a
built-in simulator that stands in for a real grow controller.

## The parts

| Part | Responsibility |
| --- | --- |
| **Grow App** | Onboarding, dashboards, alerts, recipes, diagnostics, and flashing. |
| **Grow Core** | The grow-domain model, control policies, history, and APIs. |
| **Grow Hub** | A local computer running Home Assistant OS, Grow Core, and storage. |
| **Grow Gateway** | Isolated Wi-Fi, routing, firewalling, and optional remote access. |
| **Grow Controller** | Local equipment control, monitoring, and failsafe behavior. |
| **Grow Node** | A smaller sensor or actuator with a narrow role. |

The control path for the first prototype looks like this:

```text
Grow App  ↔  Grow Core  ↔  Home Assistant (or MQTT)  ↔  ESPHome Grow Controller  ↔  fans · sensors · lights
```

Read [Concept](/documentation/concept/) for the *why*, and
[Architecture](/documentation/architecture/) for the *how*.

## Run it without hardware

The platform's current vertical slice runs end-to-end on a simulator: a Go control
engine, a live API, and a SvelteKit dashboard. No Home Assistant or ESP32 required.

You'll run two processes.

**1. Grow Core** (Go 1.24+):

```bash
cd growcore
go run ./cmd/growcore -config growcore.sim.yaml   # listens on :8080
```

**2. Grow App Web** (Node 20+):

```bash
cd web
npm install
npm run dev                                        # http://localhost:5173
```

The web app talks to Grow Core at `http://localhost:8080` by default. Set
`VITE_GROWCORE_URL` to point it elsewhere.

Open the dashboard, go to **Setup**, and lower the temperature target below the
current reading — the exhaust fan ramps up on the dashboard within a second. That
is the reconciliation engine turning *current vs. target temperature* into a
desired fan speed.

## Next steps

- [Install Grow Core on Home Assistant](/getting-started/install/) as a local add-on.
- Learn how devices are described in the [device model](/documentation/device-model/).
- Browse the [supported devices](/devices/) and see what already works.
