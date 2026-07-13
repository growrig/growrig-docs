---
title: Roadmap
description: Where GrowRig is heading, organised around demonstrable vertical slices.
sidebar:
  order: 16
---

This roadmap is directional. It is organised around demonstrable **vertical slices**
rather than a fixed release date. The Phase 2 slice — Grow Core running end-to-end
against a simulator and Home Assistant — is proven, and development has moved on to the
grow-management experience: **multi-user auth, grows and plants, a care journal,
inventory, external integrations, and an AI assistant** now run on top of the control
engine, drawing several Phase 5 items forward.

## Phase 0 — Project foundation ✅

Publish concept and architecture, define terminology, create `growrig` and
`growrig-firmware`, choose licenses, and establish the contribution process.

## Phase 1 — Breadboard fan controller

An ESP32/XIAO breadboard controller with 2–4 PWM fan channels, RPM feedback, a
temp/humidity sensor, local fallback behavior, an ESPHome package, and Home Assistant
entities. **Exit:** safe fan control continues through a Hub restart.

## Phase 2 — Grow Core vertical slice ✅

A Go service with SQLite storage, a Home Assistant adapter, an environment and
device-role model, fan controller logic, a live API, a minimal SvelteKit dashboard,
and a simulator. **Exit:** users assign grow roles instead of editing HA automations.

## Phase 3 — Dual controller connectivity

The ESPHome native-API path through Home Assistant *and* a direct MQTT path, with one
authoritative adapter per controller, controller health and presence, command timeout,
and a versioned-policy prototype. **Exit:** the same controller works through either
path.

## Phase 4 — Installation and flashing

HAOS add-on packaging, ESP Web Tools integration, supported board profiles, prebuilt
firmware manifests, USB/BLE Wi-Fi provisioning, and a controller registration flow.
**Exit:** a new user can flash and enroll a controller without editing YAML.

## Phase 5 — Grow App ◐

Polished web onboarding, a live dashboard, manual overrides, alerts, recipe basics,
cycle history, and a Flutter mobile prototype with QR pairing. **Exit:** daily
operation no longer requires the Home Assistant UI.

Much of this has landed early on **Grow App Web**: multi-user auth (password &
passkey), a live dashboard, the grow/plant records and [care journal](/docs/grows-and-plants/),
[inventory](/docs/inventory/), [feeding recipes](/docs/grows-and-plants/#feeding-recipes),
[external integrations](/docs/integrations/), and an [AI assistant](/docs/ai-assistant/).
The Flutter **Grow App Mobile** and full alerting remain ahead.

## Phase 6 — Gateway profile

Documented router setup, a recommended OpenWrt configuration, a default firewall
model, camera isolation, and Grow Hub discovery across the gateway. **Exit:** a
reproducible isolated Grow Network on commodity hardware.

## Phase 7 — Hardware maturity

Stable Controller requirements, custom PCB feasibility, integrated power and
protection, display expansion, and a hardware-in-the-loop test fixture. **Exit:**
enough evidence to design Grow Controller X4 hardware.

## Phase 8 — Ecosystem expansion

Sensor Pod, Irrigation Controller, Grow Panel, a hardware compatibility catalog, a
recipe repository, verified third-party equipment, and an optional official Grow
Gateway.

## Continuous directions

These influence early interfaces even when implemented later: a semantic installation
digital twin, signed versioned policies, secure per-device identity, rollback-safe OTA,
simulator and recorded-data replay, explainable adaptive control, structured
observability, trusted release provenance and SBOMs, and an open extension SDK.
