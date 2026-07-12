---
title: Setting it up
description: Install GrowRig on your Grow Hub and walk through first-time setup — from empty tent to running automation.
sidebar:
  order: 4
---

Once you've got your [equipment](/getting-started/what-you-need/), setting up GrowRig has
two stages: get the software running on your **Grow Hub**, then walk through the guided
setup for your grow space.

## Before you start

You'll want:

- A **Grow Hub** running [Home Assistant OS](https://www.home-assistant.io/installation/)
  (a Raspberry Pi or mini PC is ideal).
- Your climate devices added to Home Assistant. GrowRig builds on Home Assistant's
  integrations, so a fan or sensor that Home Assistant can already see is one GrowRig can
  use. Each [supported device](/devices/) links to its Home Assistant integration.

## Install Grow Core

Grow Core runs as a **local Home Assistant add-on**. It connects to Home Assistant
automatically (no tokens to copy) and serves the Grow App in your browser.

1. Build the add-on from the platform repository:
   ```bash
   make addon        # builds the binaries for your Hub's architecture
   ```
2. Copy the `addon/growrig/` folder onto your Hub's `addons` share (`/addons/growrig/`).
3. In Home Assistant, open **Settings → Add-ons → Add-on Store → ⋮ → Check for updates**,
   then install **GrowRig — Grow Core** from *Local add-ons*.

The add-on serves the dashboard on host port `8099` by default. For configuration
details, see [Configuration](/docs/configuration/) in the documentation.

:::note[Today]
Installation is hands-on for now — you build and copy the add-on yourself. A one-click
install from the add-on store is on the [roadmap](/docs/roadmap/).
:::

## First-time setup

With Grow Core running, open the Grow App and set up your grow space. The guided flow
mirrors how you actually think about your tent:

1. **Create your grow space** — name it and, if you like, pick your tent model so its air
   volume is known.
2. **Add your devices** — GrowRig looks at what Home Assistant already knows about and
   helps you bring in your fans, sensors, light, and plugs.
3. **Assign roles** — tell GrowRig what each device *does*: this fan is **exhaust**, this
   sensor is the **main** reading, and so on. (See
   [roles](/getting-started/how-it-works/#roles-not-brands).)
4. **Test your equipment** — confirm each fan and switch responds before you rely on it.
5. **Set your targets** — choose the temperature and humidity you want to hold.
6. **Start automating** — GrowRig takes over the minute-to-minute adjustments, and the
   dashboard shows live readings, fan speeds, and history.

You won't need to hand-write any Home Assistant automations — assigning roles and targets
is all GrowRig needs.

:::note[Today]
The core loop — live climate control of variable-speed fans against a target — works
now. The full guided onboarding, recipes, and alerts are being built out; follow the
[roadmap](/docs/roadmap/) for progress.
:::

## Where to go next

- Learn the model behind roles and capabilities in [The device model](/docs/device-model/).
- See exactly how Grow Core talks to your devices in
  [Home Assistant integration](/docs/home-assistant/).
- Keep it safe: [Safety &amp; security](/docs/safety/).
