---
title: What is GrowRig?
description: A friendly introduction to GrowRig — open, local-first monitoring and automation for indoor growing.
sidebar:
  order: 1
  label: What is GrowRig?
---

:::caution[Early work in progress]
GrowRig is in **early development**. The hardware, software, and device profiles are
still evolving, features may be incomplete or change, and things can break. Expect
rough edges — feedback and contributions are very welcome. Come say hi and follow
along on [Discord](/discord).
:::

GrowRig helps you **monitor and automate the climate** inside a grow tent, box, or
room — the temperature, humidity, airflow, and lighting your plants live in — so you
don't have to babysit it by hand.

Think of it as the "brain" for your grow space. You tell it the conditions you want,
and it keeps the fans and equipment working to hold those conditions, day and night.

## Who it's for

You don't need to be an engineer. GrowRig is built for:

- **Beginners** setting up their first tent who want it to "just work".
- **Hobbyists** who've outgrown manual timers and want real control and history.
- **Tinkerers** who love open hardware and want to see and change how everything works.

If you already run [Home Assistant](https://www.home-assistant.io/), you're a step
ahead — GrowRig builds on top of it. If you don't, that's fine; this guide walks you
through the whole picture.

## What makes it different

Most grow controllers lock you into one brand's app, cloud account, and accessories.
GrowRig takes the opposite approach:

- **Local-first** — it runs on a small computer in your home. No mandatory cloud
  account, and it keeps working without internet.
- **Your choice of gear** — GrowRig describes equipment by *what it does* (a fan, a
  sensor, a light), so you can mix brands and swap parts without starting over.
- **Understandable and safe** — every automatic decision is visible and explainable,
  and your equipment has safe fallback behavior if something loses connection.
- **Open** — the software, hardware designs, and device profiles are all open source.

## How you'll use it

The everyday experience is meant to be simple:

1. Tell GrowRig about your grow space and the equipment in it.
2. Set your target temperature and humidity (or pick a recipe).
3. Let it run — watch live readings, get alerts, and review history.

Behind that simplicity is a small stack of cooperating parts. The next page,
[How it works](/getting-started/how-it-works/), explains them in plain language.

:::note[Where the project is today]
GrowRig is young and being built in the open. Some of what you'll read here describes
where it's headed. We'll call out what already works as we go, and the
[roadmap](/docs/roadmap/) tracks the rest.
:::

## Next steps

- **[How it works](/getting-started/how-it-works/)** — the pieces and the control loop.
- **[What you'll need](/getting-started/what-you-need/)** — a starter equipment guide if
  you're beginning from nothing.
- **[Setting it up](/getting-started/setup/)** — get GrowRig running.
