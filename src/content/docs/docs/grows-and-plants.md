---
title: Grows & plants
description: The cultivation layer — grows, stages, plants, cultivars, species, the care journal, and feeding recipes.
sidebar:
  order: 5
---

Grow Core has two cooperating layers. The **environment layer** is physical: a
tent, its sensors and fans, and the control loop that holds a climate target
(see [Architecture](/docs/architecture/)). The **cultivation layer** sits beside
it and tracks *what you are growing* — independent of any single tent, and
crop-neutral so it works for cannabis, tomatoes, basil, or anything else.

## Grows

A **grow** is one cultivation run: a species, an optional cultivar, and a
configurable **stage sequence**. Grows have a lifecycle — `active`, `completed`,
`archived` — and progress through their stages over time.

An environment can nominate one grow as its **control grow**. That grow's
*current stage* supplies automation presets — most importantly the photoperiod
(daily light hours) — so moving a grow from *vegetative* to *flowering* can
change the light schedule without touching the environment config.

Stages are defaults you start from, not fixed phases. Every crop family ships an
editable **stage preset** (e.g. cannabis: *seedling → vegetative → flowering →
flush → drying → cure*), and any grow can define its own ordered stages.

## Plants

A grow contains **plants**. Each plant is tracked one of two ways:

- **Individual** — a single plant followed on its own.
- **Group** — a tray, bed, or batch counted by quantity.

Plants carry a lifecycle status (`active`, `harvested`, `removed`, `archived`)
and a **placement history**: each move between locations is recorded, so you can
see where a plant lived over the run. Plants can be moved, repotted, harvested,
or removed, and each action is part of the record.

## Species & cultivars

A **species** is a crop definition shipped as YAML in the platform repository
(`species/<id>/species.yaml`). It declares:

- the default **stage sequence** and each stage's default light hours;
- **cultivar attributes** — the species-specific fields a variety carries
  (cannabis, for example, declares *genetics*, *flowering type*, *THC*, *CBD*);
- **care actions** — which manual actions apply to this crop and what each
  action's form captures.

A **cultivar** is a user-defined strain or variety within a species. Beyond the
common fields (name, breeder, description, optional image) it carries values for
its species' declared attributes. Those extras live in a generic map, so adding
a field to a species' YAML needs no code change — the cultivar form renders the
fields dynamically. This is the same data-driven pattern GrowRig uses for
[inventory columns](/docs/inventory/) and [device capabilities](/docs/device-model/).

## The care journal

**Care** is the grow's manual-action log: watering, feeding, inspecting,
training, trimming, transplanting, treating, flushing, and harvesting. Which
actions are available — and what each one's form captures — comes from the
grow's species, so the journal only ever offers relevant actions.

A care action is recorded as a **session**: one event targeting one or more
plants. "Mixed 5 L and fed all four plants" is logged once, while still noting
what each plant received. Every entry is timestamped and attributed to a source
(`manual` today; an `automation` source is reserved for irrigation/dosing
equipment on the roadmap).

## Feeding recipes

**Feeding is watering with nutrients.** Both are ordinary care events (`water` /
`feed`) that differ only in the solution fields they set (recipe, pH, EC,
runoff).

A **feeding recipe** is a nutrient schedule: an ordered set of products dosed
across an ordered set of phases, each phase spanning one or more weeks. Recipes
are deliberately flexible so they can model any brand's chart. They come from
two places that share one shape and one API:

- **Built-in templates** — read-only YAML under `species/<id>/feedings.yaml`
  (for example, a BioBizz schedule for cannabis). These seed a new recipe.
- **User recipes** — created in the app and stored on disk, fully editable.

Recipe products line up with the [supported products](/products/) catalog, so a
schedule that calls for *Bio·Grow* and *Bio·Bloom* points at the same
definitions you stock in [inventory](/docs/inventory/).

## How it fits together

```text
Species (YAML) ── defines ──> stages · cultivar attributes · care actions · feeding templates
      │
Cultivar ─ a variety of a species, with attribute values
      │
Grow ─ a run: species + cultivar + stage sequence  ──(control grow)──> Environment photoperiod
      │
Plants ─ individual or group units, with placement history
      │
Care journal ─ timestamped water/feed/inspect/… sessions, per plant
```

The cultivation layer is deliberately separate from the physical control loop:
you can run the climate automation with no grow at all, or track a grow's plants
and care with no automation. Nominating a control grow is what links the two.
