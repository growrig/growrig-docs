---
title: What you'll need
description: A beginner's equipment guide for a first GrowRig setup — recommended tents, fans, lights, sensors, and the computer that runs it all.
sidebar:
  order: 3
  label: What you'll need
---

Starting from nothing? This page is a shopping guide for a first grow space that works
well with GrowRig. You don't need everything at once — start with the essentials and
add automation later.

GrowRig manages the **environment** (temperature, humidity, airflow, light timing).
Choosing seeds, growing medium, and nutrients is up to you — see the note at the bottom.

:::tip[The golden rule of sizing]
Match your **exhaust fan and light to your tent size**. An underpowered fan can't keep
a tent cool; an oversized light cooks it. The recommendations below are grouped by tent
size to keep this simple.
:::

## 1. The tent (your grow space)

A grow tent is a light-proof, reflective enclosure. Pick a size for how many plants you
want and the space you have:

| Tent size | Good for | Typical footprint |
| --- | --- | --- |
| **2'×2'** (60×60 cm) | 1 plant, learning the ropes | Closet / small room corner |
| **2'×4'** (120×60 cm) | 2–4 plants | Along a wall |
| **4'×4'** (120×120 cm) | 4+ plants | Dedicated space |

Any sturdy tent works. GrowRig has profiles for common brands — Mars Hydro, VIVOSUN,
Spider Farmer, and AC Infinity — so their dimensions are known automatically. Browse
them under [Supported devices → Grow tents](/devices/tent/), or pick "Other" and enter
your size by hand.

## 2. Airflow (the most important part)

Good air exchange controls heat **and** humidity and keeps plants healthy. You need:

- **An exhaust fan + carbon filter** — an inline duct fan pulls air out through a carbon
  filter (which also controls odor). Size the duct to your tent:
  - 2'×2' → **4‑inch**  ·  2'×4' → **4–6‑inch**  ·  4'×4' → **6‑inch**
- **A circulation fan** — a small clip-on or PC fan to keep air moving gently inside the
  tent so it doesn't stratify.

AC Infinity CLOUDLINE inline fans are a popular, GrowRig-friendly choice, and quiet PWM
PC fans work great for circulation. See [Supported devices → Fans](/devices/fan/).

:::note[Why GrowRig loves variable-speed fans]
A fan that GrowRig can *speed up and slow down* (rather than just on/off) lets it hold
your target precisely and quietly. That's what the [control loop](/getting-started/how-it-works/#the-control-loop)
adjusts.
:::

## 3. Light

An LED grow light is efficient and runs cooler than older lamps. Match wattage to tent
size (roughly 2'×2' → ~100–150 W, 2'×4' → ~200–300 W, 4'×4' → ~400–500 W of *actual*
draw). GrowRig handles the on/off schedule; see
[Supported devices → Lights](/devices/light/).

## 4. Sensors (so GrowRig can see)

At minimum you need a **temperature & humidity sensor** placed at canopy height — this is
the reading GrowRig controls against. A small Bluetooth sensor like the Xiaomi
LYWSD03MMC is inexpensive and well supported. A **CO₂ sensor** is a nice later upgrade.
Browse [Supported devices → Sensors](/devices/sensor/).

## 5. Power control (switching equipment)

A **smart plug** lets GrowRig switch equipment on and off — and energy-monitoring plugs
like the TP‑Link Tapo P110 also tell you how much power your light or fan is really
using. See [Supported devices → Smart plugs](/devices/plug/).

## 6. A controller (for smooth automation — optional at first)

To vary fan speed smoothly (instead of just on/off), GrowRig uses a small **Grow
Controller** — an ESP32 board running open [ESPHome](https://esphome.io/) firmware that
drives PWM fans and reads sensors, with safe local fallback. You can start without one
and add it when you want finer control — see
[Add a Grow Controller](/getting-started/controller/) and
[Supported devices → Controllers](/devices/controller/).

## 7. The computer that runs it (your Hub)

GrowRig runs on a small always-on computer in your home — the **Hub** — which hosts
Home Assistant, Grow Core, the Grow App, and your data, all locally. You have three
ways to get one, from most turnkey to most hands-on:

- **Buy a GrowRig Hub** — our ready-made Hub, unboxed and running *(planned)*.
- **Build a DIY Hub** — flash our image onto a
  [Home Assistant Green](https://www.home-assistant.io/green/), a **Raspberry Pi 4+
  with 2 GB+ RAM**, or a spare mini PC.
- **Use your own Home Assistant** — already run HAOS? Just add the Grow Core add-on.

[Setting it up](/getting-started/setup/) walks through all three. You don't need to
decide now — the gear above is the same regardless of which Hub you land on.

Optionally, a spare Wi‑Fi router can act as a **Grow Gateway**, putting your grow
devices on their own isolated network. This is an advanced step you can add later.

## Starter setups

Two ways to begin, depending on your budget and appetite for tinkering:

| | **Essentials kit** | **Recommended kit** |
| --- | --- | --- |
| Tent | 2'×2' | 2'×4' or 4'×4' |
| Exhaust | 4" inline fan + carbon filter | Variable-speed inline fan + filter |
| Circulation | 1 clip/PC fan | 1–2 PC fans |
| Light | LED matched to tent | LED matched to tent |
| Sensor | Temp/humidity (Bluetooth) | Temp/humidity + CO₂ |
| Power | 1 energy-monitoring smart plug | Smart plug(s) |
| Automation | On/off via smart plug | Grow Controller for smooth fan speed |
| Hub | DIY Hub (Raspberry Pi / mini PC) or your own HA | GrowRig Hub or DIY Hub, plus a Grow Gateway |

Once your gear arrives, head to [Setting it up](/getting-started/setup/).

:::caution[Responsible use]
GrowRig helps you control a climate; it does not give agricultural or legal advice.
Recommended temperature and humidity ranges are starting points, not guarantees. Always
follow the electrical ratings on your equipment and use appropriately certified gear for
mains switching. Grow only what is legal where you live.
:::
