---
title: First run
description: Open the Grow App, create your grow space, assign roles, set your targets, and let GrowRig take over the minute-to-minute climate control.
sidebar:
  order: 7
---

Your [Hub](/getting-started/setup/) is running and your
[devices](/getting-started/connect-devices/) (and maybe a
[Controller](/getting-started/controller/)) are visible to Home Assistant. This is the
fun part: telling GrowRig what everything *is* and handing it the wheel.

Open the Grow App — on a GrowRig or DIY Hub it's the add-on's **Open Web UI** button;
on your own Home Assistant it's the Grow Core add-on's dashboard (host port `8099` by
default). The guided flow mirrors how you actually think about your tent:

## 1. Create your grow space

Name it (e.g. "Tent A") and, if you like, pick your **tent model** so GrowRig knows its
air volume. Don't see your tent? Choose "Other" and enter the dimensions by hand. This
becomes an **environment** — the space GrowRig holds on target.

## 2. Add your devices

GrowRig looks at what Home Assistant already knows about and helps you bring in the fans,
sensors, light, and plugs you connected earlier. Nothing here needs entity IDs or YAML —
if a device is visible to Home Assistant, it shows up to be added.

## 3. Assign roles

This is the heart of setup. Instead of "the AC Infinity fan on plug 3", you tell GrowRig
what each device *does*:

- **Exhaust** — pulls hot, humid air out of the tent.
- **Intake / circulation** — brings in fresh air and keeps it moving.
- **Main sensor** — the temperature/humidity reading GrowRig controls against.
- **Light** — your grow light, on its schedule.

Because [roles are separate from the hardware](/getting-started/how-it-works/#roles-not-brands),
you can swap a fan or sensor later and everything keeps working. This is GrowRig's
[device model](/docs/device-model/).

## 4. Test your equipment

Before you rely on it, confirm each fan and switch actually responds — nudge a fan's
speed, toggle a plug — and check the reading you expect appears. Better to catch a
mis-wired plug now than during a hot afternoon.

## 5. Set your targets

Choose the **temperature and humidity** you want to hold. These are your goal; GrowRig
does the minute-to-minute work of getting there and staying there.

## 6. Start automating

Hand it over. GrowRig takes on the continuous adjustments — speeding the exhaust up when
the tent drifts warm, easing off when it's back on target — and the dashboard shows live
readings, fan speeds, RPM, and history. You won't hand-write a single Home Assistant
automation; roles and targets are all it needs.

:::note[What works today]
The core loop — live climate control of variable-speed fans against a target — works
now, and so do the grow/plant records, care journal, inventory, and integrations that
run alongside it. The fully polished guided onboarding, recipes, and alerting are still
being built out; the [roadmap](/docs/roadmap/) tracks the rest.
:::

## Where to go next

- Understand the model behind roles and capabilities: [The device model](/docs/device-model/).
- Track the grow itself — plants, stages, and a care journal:
  [Grows &amp; plants](/docs/grows-and-plants/).
- See exactly how Grow Core talks to your devices:
  [Home Assistant integration](/docs/home-assistant/).
- Keep it safe: [Safety &amp; security](/docs/safety/).
