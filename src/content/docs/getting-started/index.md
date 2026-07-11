---
title: GrowRig at a glance
description: The essential vocabulary, architecture, and current prototype direction.
---

GrowRig is an open-source, local-first ecosystem for monitoring and automating grow boxes, tents, rooms, and other small controlled environments.

It combines an integrated user experience with Home Assistant compatibility, open controller hardware, local autonomous operation, and replaceable equipment.

## Main parts

| Part | Responsibility |
| --- | --- |
| **Grow App** | Onboarding, dashboards, alerts, recipes, diagnostics, and flashing. |
| **Grow Core** | Grow-domain model, control policies, history, APIs, and coordination. |
| **Grow Hub** | Local computer running Home Assistant OS, Grow Core, and storage. |
| **Grow Gateway** | Isolated Wi-Fi, routing, firewalling, and optional remote access. |
| **Grow Controller** | Local equipment control, hardware monitoring, and failsafe behavior. |
| **Grow Node** | A smaller distributed sensor or actuator with a narrow role. |

## Prototype path

```text
Grow App
   ↕
Grow Core
   ↕
Home Assistant or MQTT
   ↕
ESPHome Grow Controller
   ↕
Fans · sensors · lights · other equipment
```

The controller can expose both the ESPHome native API and MQTT. Grow Core selects one authoritative command path so duplicate ownership is avoided.

## Where to continue

- Read the [project concept](/project/reference/concept/).
- Study the [architecture](/project/reference/architecture/).
- Review the [prototype plan](/project/reference/prototype/).
- Browse the [generated device catalog](/devices/catalog/).
