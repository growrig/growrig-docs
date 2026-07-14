---
title: Connect your devices
description: Get your sensors, smart plugs, and light into Home Assistant so GrowRig can see and control them — the second stage of setting up.
sidebar:
  order: 5
---

Your [Hub](/getting-started/setup/) is running — now it needs something to sense and
switch. This stage is about getting your equipment **visible to Home Assistant**, because
that's how GrowRig reaches it.

:::tip[The one rule that makes this simple]
GrowRig builds on Home Assistant. **A device Home Assistant can already see is one
GrowRig can use.** So the whole job here is: add each device to Home Assistant, confirm
it shows a live reading or responds to a switch — then GrowRig picks it up in
[first run](/getting-started/first-run/).
:::

Every entry in [Supported devices](/devices/) links to the Home Assistant integration it
uses, so you can always check *how* a specific product connects before you buy or add it.

## The minimum to get going

You don't need everything at once. A useful first setup is just **one temperature &
humidity sensor** (so GrowRig can see the climate) and **one smart plug** (so it can
switch your fan or light). Add the rest whenever you like.

| For a basic setup | For fuller control (add later) |
| --- | --- |
| Temp/humidity sensor | CO₂ sensor, extra sensors per zone |
| One smart plug (fan or light) | A plug per device, energy monitoring |
| — | A [Grow Controller](/getting-started/controller/) for variable-speed fans |

## Add a temperature & humidity sensor

This is the reading GrowRig controls against, so start here. Place it at **canopy
height**, away from direct airflow.

- **Bluetooth sensors** (e.g. the Xiaomi LYWSD03MMC) are cheap and well supported. Home
  Assistant's **Bluetooth** integration auto-discovers them when they're in range of the
  Hub. If the Hub is far from the tent, an **ESPHome Bluetooth proxy** (any cheap ESP32)
  extends the range.
- Once Home Assistant shows a live temperature and humidity for the sensor, you're done.

See [Supported devices → Sensors](/devices/sensor/) for connection details per model.

## Add a smart plug

A smart plug lets GrowRig switch a fan, light, or humidifier on and off — and
energy-monitoring models also report how much power the equipment draws.

- Wi-Fi plugs like the **TP-Link Tapo P110** add through Home Assistant's TP-Link
  integration.
- After adding, toggle the plug from the Home Assistant UI once to confirm it responds.

See [Supported devices → Smart plugs](/devices/plug/).

## Add your light

Simplest is to put your LED grow light on a **smart plug** and let GrowRig switch it on
its schedule. Lights with their own Home Assistant integration work too — add them the
same way and confirm they turn on and off. See [Supported devices → Lights](/devices/light/).

:::note[On/off vs. variable speed]
Plugs give you **on/off** control — perfect for lights and simple fans. To vary a fan's
*speed* smoothly (which is how GrowRig holds a target precisely and quietly), you'll want
a [Grow Controller](/getting-started/controller/) — the next stage, and an optional one.
:::

## Next

- Want smooth fan control? **[Add a Grow Controller](/getting-started/controller/)**.
- Happy with on/off for now? Skip ahead to **[First run](/getting-started/first-run/)**
  and start assigning roles.
