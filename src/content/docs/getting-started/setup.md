---
title: Setting it up
description: Get GrowRig running on a Hub — buy a GrowRig Hub, flash a DIY Hub yourself, or add Grow Core to your own Home Assistant — then walk through first-time setup.
sidebar:
  order: 4
---

Everything GrowRig does runs on a **Hub**: a small, always-on computer in your home
that hosts [Home Assistant](https://www.home-assistant.io/), Grow Core, the Grow App,
and your data — all locally. Getting from an empty tent to running automation is a short
journey in four stages:

1. **Set up your Hub** — this page. The brain that runs everything.
2. **[Connect your devices](/getting-started/connect-devices/)** — get your sensors,
   plugs, and light visible to Home Assistant so GrowRig can use them.
3. **[Add a Grow Controller](/getting-started/controller/)** *(optional)* — a small board
   for smooth, variable-speed fan control instead of plain on/off.
4. **[First run](/getting-started/first-run/)** — open the Grow App, assign roles, set
   your targets, and let it take over.

Stage 1 is the Hub. There are three ways to get one, from most turnkey to most
hands-on — pick the one that matches how much you want to build yourself. The software
and everything after this page are identical on all three.

:::note[This page is also a plan]
GrowRig is [early and being built in the open](/getting-started/), and the three paths
below are at different stages of readiness. Each one is tagged with where it stands
today, so this page doubles as a map of where the project is heading. When in doubt,
**path 3 works right now**.
:::

## Choose your Hub

| | **1 · GrowRig Hub** | **2 · DIY Hub** | **3 · Your own Home Assistant** |
| --- | --- | --- | --- |
| What it is | Our ready-made Hub, unboxed and ready | HA Green, a Raspberry Pi, or a spare PC you flash yourself | Add Grow Core to a Home Assistant you already run |
| You provide | Nothing but power & network | The board/PC | An existing HAOS install |
| Effort | Plug in and go | Flash one image | Install one add-on |
| Best for | Anyone who wants it to just work | Tinkerers and existing Pi owners | Current Home Assistant users |
| Status | 🔜 **Planned** | 🚧 **In progress** | ✅ **Works today** |

Whichever you choose, you end up with the same thing: a Hub running Home Assistant OS
with Grow Core alongside it. The rest of the docs — devices, roles, targets — apply
identically.

## Path 1 · Buy a GrowRig Hub

The simplest path: a **GrowRig Hub** is a purpose-built little computer that arrives
with Home Assistant OS and Grow Core already installed and tuned. Plug in power and
network, open the Grow App, and go straight to [first-time setup](#first-time-setup).
No flashing, no add-ons, no command line.

:::note[Status: planned]
The GrowRig Hub product doesn't exist yet — it's the destination we're building toward,
and it's why the software is packaged the way it is. Until it ships, use **path 2** to
turn commodity hardware into the same thing, or **path 3** if you already run Home
Assistant. Want one when it's ready? Let us know on [Discord](/discord).
:::

## Path 2 · Build a DIY Hub

Turn hardware you buy (or already own) into a Hub by flashing a single GrowRig disk
image that bundles **Home Assistant OS + Grow Core + the Grow App**. Good target
hardware:

- **[Home Assistant Green](https://www.home-assistant.io/green/)** — the easiest
  buy-it option: a small, silent, ready-to-run box.
- **Raspberry Pi 4 or newer, 2 GB RAM or more** — with an SD card or, better, an
  SSD/NVMe.
- **Almost any spare mini PC or laptop** (x86-64) — repurpose old hardware.

The goal is that flashing our image is all it takes — the equivalent of Home Assistant's
own [installer](https://www.home-assistant.io/installation/), with GrowRig already
inside.

:::note[Status: in progress]
The prebuilt, all-in-one GrowRig image isn't published yet. **In the meantime you can
build the exact same Hub in two well-trodden steps:**

1. Install **Home Assistant OS** on your board or PC using the official
   [Home Assistant installation guide](https://www.home-assistant.io/installation/).
   (This is what the GrowRig image will automate.)
2. Add Grow Core to it by following **[path 3](#path-3--add-grow-core-to-your-own-home-assistant)** below.

That gets you a fully working DIY Hub today; the single-image flow is purely about
skipping step 1.
:::

## Path 3 · Add Grow Core to your own Home Assistant

Already running Home Assistant OS on a Pi, a NUC, HA Green/Yellow, or a VM? Then you
already have a Hub — you just need Grow Core on it. Grow Core installs as a **local
Home Assistant add-on**. It connects to Home Assistant automatically through the
Supervisor (no tokens to copy) and serves the Grow App in your browser.

Today this is a manual, hands-on install from the
[platform repository](https://github.com/growrig):

1. Build the add-on binaries for your Hub's architecture:
   ```bash
   make addon        # cross-compiles the arch-matched binaries
   ```
2. Copy the `ha-addon/growrig/` folder onto your Hub's `addons` share
   (`/addons/growrig/`).
3. In Home Assistant, open **Settings → Add-ons → Add-on Store → ⋮ → Check for
   updates**, then install **GrowRig — Grow Core** from *Local add-ons* and click
   **Start**.
4. Click **Open Web UI** (the add-on serves the dashboard on host port `8099` by
   default).

For options and details see [Configuration](/docs/configuration/) and the
[Home Assistant integration](/docs/home-assistant/) page.

:::note[Status: works today — getting easier]
The manual local-add-on install above works right now. A **one-click install** from a
GrowRig add-on repository — add a URL under *Add-on Store → ⋮ → Repositories*, then
click Install — is coming next, so you won't need to build or copy anything. The
[roadmap](/docs/roadmap/) tracks it.
:::

## Next: connect your devices

With a Hub running, you have the brain — now give it something to sense and control.
Continue to **[Connect your devices](/getting-started/connect-devices/)** to bring your
sensors, plugs, and light into Home Assistant so GrowRig can use them.

- Want smooth, variable-speed fans instead of on/off? See
  [Add a Grow Controller](/getting-started/controller/).
- Ready to drive it all from the app? Jump to [First run](/getting-started/first-run/).

## Where to go deeper

- Learn the model behind roles and capabilities in [The device model](/docs/device-model/).
- See exactly how Grow Core talks to your devices in
  [Home Assistant integration](/docs/home-assistant/).
- Keep it safe: [Safety &amp; security](/docs/safety/).
