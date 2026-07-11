# Roadmap

This roadmap is directional. It is intentionally organized around demonstrable vertical slices rather than a fixed release date.

## Phase 0 — project foundation

- publish concept and architecture;
- define terminology;
- create `growrig-platform`;
- create `growrig-firmware`;
- choose initial licenses;
- establish contribution and decision process.

**Exit:** project direction is understandable without private context.

## Phase 1 — breadboard fan controller

- ESP32/XIAO breadboard controller;
- 2–4 PWM fan channels;
- RPM feedback;
- temperature/humidity sensor;
- local fallback behavior;
- ESPHome package;
- Home Assistant entities.

**Exit:** safe fan control continues through a Hub restart.

## Phase 2 — Grow Core vertical slice

- Go service;
- SQLite storage;
- Home Assistant adapter;
- environment and device-role model;
- fan controller logic;
- live API;
- minimal SvelteKit dashboard;
- simulator.

**Exit:** users assign grow roles instead of editing HA automations.

## Phase 3 — dual controller connectivity

- ESPHome native API path through Home Assistant;
- direct MQTT path;
- one authoritative adapter per controller;
- controller health and presence;
- command timeout;
- versioned policy prototype.

**Exit:** the same ESPHome-based controller works through either path.

## Phase 4 — installation and flashing

- HAOS app packaging;
- ESP Web Tools integration;
- supported board profiles;
- prebuilt firmware manifests;
- USB/BLE Wi-Fi provisioning;
- controller registration flow;
- diagnostic bundle.

**Exit:** a new user can flash and enroll a supported controller without editing YAML.

## Phase 5 — Grow App

- polished web onboarding;
- live dashboard;
- manual overrides;
- alerts;
- recipe basics;
- cycle history;
- Flutter mobile app prototype;
- QR pairing and journal photos.

**Exit:** daily operation no longer requires the Home Assistant UI.

## Phase 6 — Gateway profile

- documented generic router setup;
- recommended OpenWrt configuration;
- default firewall model;
- camera isolation guidance;
- Grow Hub discovery across the gateway;
- optional VPN integration.

**Exit:** a reproducible isolated Grow Network can be deployed using commodity hardware.

## Phase 7 — hardware maturity

- stable Controller requirements;
- custom PCB feasibility;
- integrated power and protection;
- display expansion;
- Grove accessory catalog;
- hardware-in-the-loop test fixture.

**Exit:** enough evidence exists to design Grow Controller X4 hardware.

## Phase 8 — ecosystem expansion

- Sensor Pod;
- Irrigation Controller;
- Grow Panel;
- hardware compatibility catalog;
- recipe repository;
- verified third-party equipment;
- optional official Grow Gateway.

## Continuous future directions

These should influence early interfaces even if implemented later:

- semantic installation digital twin;
- signed versioned controller policies;
- secure per-device identity;
- signed rollback-safe OTA;
- simulator and recorded-data replay;
- hardware-in-the-loop testing;
- explainable adaptive control;
- energy and climate optimization;
- structured observability;
- trusted release provenance and SBOMs;
- open extension SDK;
- local camera and timelapse integration.
