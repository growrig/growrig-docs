---
title: How it works
description: The parts of a GrowRig system and the simple control loop that keeps your grow space on target.
sidebar:
  order: 2
---

GrowRig is a few small parts that each do one job. You don't have to understand all of
them to use it, but a quick mental model makes setup and troubleshooting much easier.

## The parts

| Part | In plain terms |
| --- | --- |
| **Grow App** | The screen you actually use — dashboards, setup, alerts, and history. |
| **Grow Core** | The brain. It knows your targets and decides what the equipment should do. |
| **Hub** | The small computer in your home that runs everything (Home Assistant + Grow Core). Can be a ready-made *GrowRig Hub*, a *DIY Hub* you flash yourself, or your own Home Assistant. |
| **Grow Gateway** | The network that keeps your grow devices on their own safe Wi‑Fi. *(Optional at first.)* |
| **Grow Controller** | A small board near the tent that drives fans and reads sensors, with safe local fallback. |
| **Sensors & equipment** | Your thermometer/hygrometer, fans, light, and plugs. |

Home Assistant sits quietly underneath, handling the "plumbing" of talking to all
those different devices. GrowRig adds the grow-specific brain on top so you think in
terms of *tents, targets, and roles* — not entity IDs and wiring.

## The big picture

Here's how a command flows from you down to a fan:

```text
You → Grow App → Grow Core → Home Assistant → Grow Controller → your fan
```

…and readings flow back up the same path, so the app always shows what's really
happening.

## The control loop

At its heart, GrowRig repeats one simple idea, over and over:

```text
What's happening now   (e.g. it's 28 °C)
        compared to
What you asked for      (target: 24 °C)
        decides
What the equipment does (speed the exhaust fan up)
```

This is called **reconciliation**. If the tent drifts too warm, the exhaust fan ramps
up; once it's back on target, it eases off. You set the goal; GrowRig does the minute-
to-minute work.

## Roles, not brands

Instead of "AC Infinity fan on plug #3", you assign each piece of equipment a **role**:

- **Exhaust** — pulls hot, humid air out of the tent.
- **Intake / circulation** — brings in fresh air and keeps it moving.
- **Main sensor** — the temperature/humidity reading GrowRig controls against.
- **Light** — your grow light, on its schedule.

Because roles are separate from the actual hardware, you can replace a fan or sensor
later and everything keeps working. This is the heart of GrowRig's
[device model](/docs/device-model/).

## More than the climate

Holding your target conditions is the core job, but GrowRig also helps you keep track
of the grow itself:

- **Grows & plants** — set up a grow, track its plants (individually or as a batch),
  and move them through stages like *seedling → vegetative → flowering*.
- **Care journal** — log watering, feeding, training, and inspections, with photos, so
  you have a real history of what you did and when.
- **Inventory** — keep a stocked list of nutrients, media, and supplies, starting from
  built-in product templates.
- **Assistant** — an optional AI helper you can point at your own local model, that
  answers questions with the context of your grow.

These are all optional — you can use GrowRig purely for climate automation and ignore
the rest.

## Safety is built in

GrowRig controls real equipment, so safe behavior is a core part of the design, split
across layers:

- The **Grow Controller** keeps fans at a safe speed even if it loses contact with the
  Hub, and reacts to an emergency over-temperature on its own.
- **Grow Core** watches for stale sensors, enforces limits, and raises alerts.
- The **app** always shows *why* something changed and which reading caused it.

You can read more in [Safety &amp; security](/docs/safety/).

## Next

Know what the system is made of? Next, see [what you'll need](/getting-started/what-you-need/)
to build one — including recommended gear if you're starting from scratch.
