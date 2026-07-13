---
title: Terminology
description: A glossary of GrowRig terms. Clear naming is part of the architecture.
sidebar:
  order: 15
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
`sensor.temperature`, or `switch.binary`. Integrations also provide capabilities
(`ai.chat`, `weather.forecast`, `notification.send`) that features bind to.

## Cultivation

**Grow** — a cultivation run: a species, an optional cultivar, and a configurable
stage sequence. An environment may nominate a **control grow** whose current stage
supplies automation presets.

**Stage** — one step in a grow's ordered sequence (e.g. *seedling → vegetative →
flowering*), carrying defaults such as daily light hours.

**Plant** — a tracked unit in a grow, followed either **individually** or as a
**group** (a tray or batch counted by quantity), with a placement history.

**Species** — a crop definition (YAML) declaring stages, cultivar attributes, care
actions, and built-in feeding templates.

**Cultivar** — a user-defined strain or variety within a species, carrying that
species' declared attribute values.

**Care** — the grow's manual-action journal (watering, feeding, inspecting, training,
etc.). A care action is a session targeting one or more plants.

**Feeding recipe** — a nutrient schedule: products dosed across phases over weeks.
Distinct from a climate **Recipe** (targets and phase transitions).

## Inventory & integrations

**Inventory category** — a class of stored things (consumables, equipment, …) that
declares the columns and units its items carry.

**Product** — a built-in template for a real-world item; picking one pre-fills and
binds a new inventory item to the definition.

**Inventory item** — a stock record the grower owns, with one or more size variants,
each with its own on-hand quantity.

**Integration bundle** — a reusable definition of an external service (its
capabilities, config, and runtime).

**Integration instance** — a configured copy of a bundle, with encrypted secrets.

**Integration binding** — a mapping from a feature+capability to an instance, global
or scoped to a grow or environment.

**AI assistant** — an optional, grow-scoped chat backed by an integration providing
the `ai.chat` capability. Advisory only; it does not command equipment.

**User / Admin** — GrowRig is multi-user. Any signed-in **user** sees their permitted
environments; an **admin** manages configuration, users, and integrations.
