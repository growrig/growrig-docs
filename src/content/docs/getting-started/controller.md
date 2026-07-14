---
title: Add a Grow Controller
description: Add an ESP32-based Grow Controller for smooth, variable-speed fan control with safe local fallback — an optional third stage of setting up.
sidebar:
  order: 6
---

This stage is **optional**. If your fans are on [smart plugs](/getting-started/connect-devices/#add-a-smart-plug),
GrowRig can already switch them on and off — you can skip straight to
[first run](/getting-started/first-run/). Add a Grow Controller when you want the next
level of control.

## Why a Controller

A smart plug can only turn a fan **fully on or fully off**. A **Grow Controller** lets
GrowRig set a fan's *speed* — anywhere from a gentle idle to full exhaust — so it can hold
your target temperature precisely and quietly, ramping up only as much as it needs. It's
what the [control loop](/getting-started/how-it-works/#the-control-loop) actually adjusts.

Just as important, the Controller is where GrowRig's **safety** lives closest to the
hardware: it keeps your fans at a safe speed even if it loses contact with the Hub, and
reacts to an emergency over-temperature on its own. See
[Safety &amp; security](/docs/safety/).

## What it is

A Grow Controller is a small **ESP32 board running open [ESPHome](https://esphome.io/)
firmware**, mounted near your tent. The reference design exposes:

- **two independently controllable PWM fan channels**, each with tachometer (RPM)
  feedback, and
- optionally an onboard **temperature & humidity sensor**.

It's a [supported device](/devices/controller/) like any other — browse
[Supported devices → Controllers](/devices/controller/) for the current board profiles.

## How it connects

The Controller reaches GrowRig through Home Assistant, the same as
[every other device](/getting-started/connect-devices/):

```text
Grow Controller → ESPHome native API → Home Assistant → Grow Core
```

Once flashed, the board's fan channels and sensors appear in Home Assistant as entities,
and GrowRig drives the fans from there. (A direct **MQTT** path that keeps working while
Home Assistant restarts is also part of the design — see [Architecture](/docs/architecture/#controller-connectivity).)

## Setting one up today

Controller setup is the most hands-on — and fastest-moving — part of GrowRig. Today it's
a **DIY, ESPHome-based flow**:

1. Build the reference controller (an ESP32 with PWM fan outputs and tachometer inputs).
2. Flash it with the GrowRig **ESPHome** package and provision it onto your Wi-Fi.
3. Add it to Home Assistant via the **ESPHome** integration — its fan channels and any
   sensors show up as entities.
4. In [first run](/getting-started/first-run/), assign each channel a role (**exhaust**,
   **circulation**, …) just like any other device.

:::note[Status: DIY today, guided flashing coming]
Right now this means working with ESPHome directly. A much smoother path is on the
[roadmap](/docs/roadmap/#phase-4--installation-and-flashing): **in-browser flashing**
(ESP Web Tools), supported **board profiles**, prebuilt firmware manifests, USB/BLE
Wi-Fi provisioning, and a **controller registration flow** — so a new user can flash and
enroll a controller without touching YAML. Purpose-built controller hardware follows
later (see [Phase 7](/docs/roadmap/#phase-7--hardware-maturity)).
:::

:::caution[If your fan channels aren't `fan` entities]
GrowRig commands fans with Home Assistant's `fan.set_percentage`. If your ESPHome PWM
outputs are exposed as `number` or `light` entities instead, the binding needs
adjusting — see [Home Assistant integration](/docs/home-assistant/#commanding-fans).
:::

## Next

Hardware in place? Head to **[First run](/getting-started/first-run/)** to assign roles,
set your targets, and start automating.
