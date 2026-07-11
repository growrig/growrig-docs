# GrowRig concept

## Vision

GrowRig is an open-source, local-first platform for monitoring and automating grow boxes, tents, rooms, and small controlled-environment installations.

It should offer the usability of an integrated commercial ecosystem without requiring:

- proprietary device buses;
- mandatory cloud accounts;
- closed mobile applications;
- manufacturer-specific equipment;
- undocumented automation behavior.

A user should be able to:

1. buy a preconfigured system;
2. assemble a recommended system from verified hardware;
3. build and modify everything using open software and reference hardware.

## Problem

### Proprietary grow ecosystems

Commercial systems often deliver good onboarding and tightly integrated devices, but create lock-in around:

- controllers;
- connectors;
- mobile apps;
- cloud services;
- equipment catalogs;
- firmware updates.

### DIY Home Assistant systems

DIY systems are flexible but expose low-level concepts:

- entity IDs;
- MQTT topics;
- GPIO numbers;
- helpers and automations;
- Modbus registers;
- ESPHome configuration.

GrowRig should hide these details behind a grow-specific domain model while keeping them accessible to advanced users.

## Product thesis

```text
Integrated product experience
        +
Home Assistant compatibility
        +
Open controller hardware
        +
Local autonomous operation
        +
Replaceable equipment
```

## Main ecosystem roles

### Grow App

The interface used for:

- onboarding;
- dashboards;
- alerts;
- recipes;
- cycle tracking;
- journal entries;
- photos;
- diagnostics;
- firmware flashing.

The web app is expected to use SvelteKit. A native Flutter application can provide BLE provisioning, QR pairing, notifications, camera uploads, and offline access.

### Grow Core

The local backend and source of truth for:

- grow environments;
- zones;
- device roles;
- recipes;
- cycle phases;
- target ranges;
- controller policies;
- alarms;
- diagnostics;
- journal metadata;
- normalized historical data.

Grow Core should be written in Go and run as a Home Assistant OS app or standalone container.

### Grow Hub

The local compute appliance.

The first recommended Hub can be any reliable machine running Home Assistant OS. A future official appliance may ship preconfigured.

### Grow Gateway

The networking boundary.

For now, Grow Gateway can be any suitable Wi-Fi router that creates an isolated network for:

- Grow Hub;
- Grow Controller;
- sensor nodes;
- cameras;
- smart equipment.

Later, the project may provide a preconfigured OpenWrt image or dedicated gateway hardware.

### Grow Controller

The local control device close to the physical grow environment.

It executes:

- fan control;
- schedules;
- local safety behavior;
- communication-loss fallback;
- sensor monitoring;
- manual overrides.

The first controller will be a breadboard prototype based on an ESP32 or XIAO module.

### Grow Nodes

Smaller devices with narrower roles, for example:

- environment sensor;
- CO₂ sensor;
- leak sensor;
- irrigation output;
- remote fan controller.

## Hardware strategy

The project should support three hardware paths:

### Existing hardware

Anything exposed through Home Assistant:

- ESPHome;
- Zigbee;
- MQTT;
- Modbus;
- Matter;
- Shelly;
- Bluetooth;
- local cameras.

### GrowRig reference hardware

Documented and reproducible designs using accessible components such as:

- XIAO modules;
- Grove sensors;
- standard PWM fans;
- open-drain drivers;
- RS-485 adapters;
- common displays.

### Official hardware

Later, proven prototypes can become supported products:

- Grow Controller X4;
- Sensor Pod;
- Irrigation Controller;
- Grow Panel;
- Grow Gateway.

## User experience

Normal users should see:

```text
Create grow environment
    ↓
Discover devices
    ↓
Assign roles
    ↓
Test equipment
    ↓
Configure safe fallback behavior
    ↓
Choose targets or recipe
    ↓
Start automation
```

They should not need to manually create Home Assistant automations.

## Openness

The ecosystem should publish:

- source code;
- APIs;
- protocol documentation;
- ESPHome packages;
- hardware manifests;
- recipes;
- PCB files when hardware exists;
- enclosure models;
- compatibility tests;
- release provenance.

## Long-term differentiation

The strongest differentiator is not an “AI grow mode.”

It is a system in which every decision can be:

- executed locally;
- simulated;
- tested;
- observed;
- explained;
- reproduced;
- overridden safely.
