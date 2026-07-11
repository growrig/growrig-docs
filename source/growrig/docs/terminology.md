# Terminology

Clear naming is part of the architecture.

## GrowRig

The complete ecosystem.

## Grow App

The user-facing interface.

Implementations:

- Grow App Web;
- Grow App Mobile.

## Grow Core

The backend and grow-domain control engine.

Grow Core:

- models environments;
- stores configuration;
- evaluates policies;
- coordinates devices;
- exposes APIs;
- communicates with Home Assistant and native devices.

## Grow Hub

The local computer running:

- Home Assistant OS;
- Grow Core;
- the web interface;
- local storage;
- optional MQTT and ESPHome services.

The Hub is compute, not networking.

## Grow Gateway

The network role that provides:

- private Grow Wi-Fi;
- routing;
- firewalling;
- isolation from the home LAN;
- optional VPN or remote access.

For now, it may be any suitable router.

Later, it may become a preconfigured OpenWrt device or official hardware.

## Grow Controller

A device that coordinates physical equipment and makes local decisions.

Example:

- four-channel PWM fan controller;
- climate controller;
- irrigation controller.

A Controller retains safe behavior when the Hub is unavailable.

## Grow Node

A smaller device with a narrow role.

Examples:

- temperature sensor node;
- leak node;
- remote fan node;
- valve node.

## Grow Panel

An optional local OLED/ePaper display.

## Environment

A controlled physical space such as:

- grow box;
- tent;
- room;
- propagation chamber.

## Zone

A logical or physical subdivision of an environment.

## Role

The purpose assigned to a device capability.

Examples:

- exhaust fan;
- intake fan;
- circulation fan;
- main temperature sensor;
- humidifier;
- irrigation pump.

## Recipe

A versioned declarative description of target conditions and phase transitions.

## Cycle

A running instance of a recipe or custom plan.

## Policy

A versioned set of targets, limits, schedules, and fallback rules sent to a Controller.

## Hardware profile

A machine-readable description of a supported product or module.

## Capability

A semantic feature exposed by a device.

Examples:

```text
fan.speed
fan.rpm
sensor.temperature
sensor.humidity
switch.binary
display.status
```
