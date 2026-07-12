---
title: Home Assistant integration
description: How Grow Core talks to Home Assistant, and what each side is responsible for.
sidebar:
  order: 5
---

Home Assistant is GrowRig's compatibility layer. It handles device discovery,
protocol translation, and current state; Grow Core adds the grow-domain model,
control policies, and history on top.

## How Grow Core connects

The Home Assistant adapter reads climate sensors over the **Home Assistant WebSocket
API** and commands fans via **REST service calls**. It connects one of two ways,
chosen purely by configuration:

- **Supervisor proxy** — when running as a HAOS add-on, Grow Core reaches Home
  Assistant at `http://supervisor/core` using `$SUPERVISOR_TOKEN`. No manual token.
- **Remote Home Assistant** — for local development, point Grow Core at
  `http://homeassistant.local:8123` with a long-lived access token.

See [Configuration](/docs/configuration/) for the exact files and modes.

## Commanding fans

The adapter uses **`fan.set_percentage`** to drive PWM outputs. If your ESPHome PWM
channels are exposed as `number` or `light` entities instead of `fan` entities, that
service call needs adjusting — bind the correct entity IDs in the config's `fan.*`
mappings.

## Binding entities

The config declares environments and devices, and binds each device's sensors and fan
channels to Home Assistant entities. Edit the `sensor.*` and `fan.*` entity IDs to
match your ESPHome controller. Running with no config at all falls back to the
built-in [simulator](/getting-started/#run-it-without-hardware).

## Who owns what

Grow Core deliberately does not duplicate Home Assistant's responsibilities:

| Home Assistant owns | Grow Core owns |
| --- | --- |
| Raw entity states | Semantic device roles |
| Protocol connectivity & discovery | Environments, recipes, control policies |
| Generic history | Cycle history, alerts, diagnostics |

This separation means Home Assistant can restart, or a device can be swapped, without
GrowRig losing the meaning of your setup.
