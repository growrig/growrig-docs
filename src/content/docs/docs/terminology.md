---
title: Terminology
description: A glossary of GrowRig terms. Clear naming is part of the architecture.
sidebar:
  order: 9
---

Clear naming is part of the architecture.

**GrowRig** — the complete ecosystem.

**Grow App** — the user-facing interface. Implementations: Grow App Web and Grow App
Mobile.

**Grow Core** — the backend and grow-domain control engine. It models environments,
stores configuration, evaluates policies, coordinates devices, exposes APIs, and
communicates with Home Assistant and native devices.

**Grow Hub** — the local computer running Home Assistant OS, Grow Core, the web
interface, local storage, and optional MQTT/ESPHome services. The Hub is *compute*,
not networking.

**Grow Gateway** — the network role providing private Grow Wi-Fi, routing,
firewalling, isolation from the home LAN, and optional remote access. For now it may be
any suitable router.

**Grow Controller** — a device that coordinates physical equipment and makes local
decisions (for example, a four-channel PWM fan controller). It retains safe behavior
when the Hub is unavailable.

**Grow Node** — a smaller device with a narrow role: a temperature node, leak node,
remote fan node, or valve node.

**Grow Panel** — an optional local OLED / ePaper display.

**Environment** — a controlled physical space such as a grow box, tent, room, or
propagation chamber.

**Zone** — a logical or physical subdivision of an environment.

**Role** — the purpose assigned to a device capability, such as exhaust fan, intake
fan, circulation fan, main temperature sensor, humidifier, or irrigation pump.

**Recipe** — a versioned declarative description of target conditions and phase
transitions.

**Cycle** — a running instance of a recipe or custom plan.

**Policy** — a versioned set of targets, limits, schedules, and fallback rules sent to
a controller.

**Hardware profile** — a machine-readable description of a supported product or module.

**Capability** — a semantic feature exposed by a device, such as `fan.speed`,
`sensor.temperature`, or `switch.binary`.
