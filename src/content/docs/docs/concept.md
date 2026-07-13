---
title: Concept
description: The vision behind GrowRig — an integrated product experience without the lock-in.
sidebar:
  order: 2
---

## Vision

GrowRig is an open-source, local-first platform for monitoring and automating grow
boxes, tents, rooms, and small controlled-environment installations. It should offer
the usability of an integrated commercial ecosystem without requiring proprietary
device buses, mandatory cloud accounts, closed mobile apps, manufacturer-specific
equipment, or undocumented automation behavior.

A user should be able to:

1. buy a preconfigured system;
2. assemble a recommended system from verified hardware; or
3. build and modify everything using open software and reference hardware.

GrowRig is more than a climate controller. Alongside the automation it tracks the
**cultivation** itself — [grows, plants, cultivars, and a care journal](/docs/grows-and-plants/) —
keeps a stocked [inventory](/docs/inventory/) of the supplies a grow consumes, and
connects to outside services through pluggable [integrations](/docs/integrations/),
including an optional grow-scoped [AI assistant](/docs/ai-assistant/). All of it stays
local-first and observable.

## The problem

**Proprietary grow ecosystems** often deliver good onboarding and tightly integrated
devices, but create lock-in around controllers, connectors, mobile apps, cloud
services, equipment catalogs, and firmware updates.

**DIY Home Assistant systems** are flexible but expose low-level concepts — entity
IDs, MQTT topics, GPIO numbers, helpers, Modbus registers, ESPHome configuration.
GrowRig hides these behind a grow-specific domain model while keeping them accessible
to advanced users.

## Product thesis

```text
Integrated product experience
        + Home Assistant compatibility
        + Open controller hardware
        + Local autonomous operation
        + Replaceable equipment
```

## Hardware strategy

The project supports three hardware paths:

- **Existing hardware** — anything exposed through Home Assistant: ESPHome, Zigbee,
  MQTT, Modbus, Matter, Shelly, Bluetooth, local cameras.
- **GrowRig reference hardware** — documented, reproducible designs using accessible
  components such as XIAO modules, Grove sensors, standard PWM fans, and RS-485
  adapters.
- **Official hardware** — later, proven prototypes can become supported products.

## User experience

Normal users should move through a guided flow and never need to hand-write Home
Assistant automations:

```text
Create grow environment → Discover devices → Assign roles → Test equipment →
Configure safe fallback → Choose targets or recipe → Start automation →
Track plants, care & inventory as the grow runs
```

## Long-term differentiation

The strongest differentiator is not an "AI grow mode." It is a system in which every
decision can be executed locally, simulated, tested, observed, explained, reproduced,
and overridden safely.
