---
title: Inventory & products
description: How GrowRig tracks stock — categories, built-in product templates, and the items you own.
sidebar:
  order: 6
---

GrowRig tracks the physical supplies a grow consumes and the equipment it uses.
The inventory has three parts: **categories** define the shape of what you can
store, **products** are ready-made templates the project ships, and **items**
are the actual stock you own.

## Categories

A **category** is a class of stored things, defined as YAML in the platform
repository (`inventory/<category>/inventory.yaml`). The seed set is:

| Category | What it holds |
| --- | --- |
| **Consumables** | Nutrients, media, pH & calibration solutions, cleaning products, filters. |
| **Plant material** | Seeds, clones, mother plants, preserved genetics. |
| **Equipment & spare parts** | Fans, pumps, sensors, lights, controllers, power supplies, replacement parts. |
| **Growing & irrigation supplies** | Pots, trays, tubing, drippers, fittings, stakes, nets, training supplies. |
| **Harvest & storage** | Jars, bags, labels, drying and trimming supplies. |

Each category declares its **units** and its **columns** — the category-specific
fields an item carries. The item form renders those columns dynamically, and the
API drops any value whose key the category doesn't declare. This is the same
data-driven approach used by [cultivar attributes](/docs/grows-and-plants/) and
[device capabilities](/docs/device-model/): the schema lives in YAML, not in
code.

```yaml
# inventory/consumables/inventory.yaml (excerpt)
label: Consumables
units: [pcs, L, ml, kg, g]
columns:
  - { key: kind, label: Kind, type: enum, options: [nutrient, additive, media, ph-solution, cleaning, filter] }
  - { key: brand, label: Brand, type: text }
  - { key: expiry, label: Expiry, type: date }
```

## Products (built-in templates)

A **product** is a ready-made template for a real-world item, shipped as YAML
(`inventory/<category>/products.yaml`). Picking a product when you add an item
pre-fills its name, pack sizes, and column values, and **binds the item to the
product by id**. Because the binding is by id, a bound item keeps reflecting the
product definition — its image, description, and variant codes — as those
definitions evolve.

Each product declares the pack **variants** it sells in (a `size` label and an
optional `code` / SKU), plus attribute values that must match the category's
columns:

```yaml
# inventory/consumables/products.yaml (excerpt)
products:
  - id: biobizz-bio-grow
    name: BioBizz Bio·Grow
    description: Organic liquid growth fertilizer…
    attributes: { kind: nutrient, brand: BioBizz }
    variants:
      - { size: 250 ml }
      - { size: 1 L }
      - { size: 5 L }
```

The full catalog is browsable at **[Supported products](/products/)**, generated
directly from these definitions — the same way the [Supported
devices](/devices/) catalog is generated from device profiles.

## Items (your stock)

An **item** is a stock record you own. It belongs to a category, carries that
category's column values, and holds one or more **stock lines** — one per pack
size, each with its own on-hand quantity and optional low-stock threshold. A
nutrient can therefore be tracked as "3 × 1 L" and "1 × 5 L" at once; a simple
item is a single line with a blank size.

Items may be **bound** to a product template (inheriting its image, description,
and codes) or be entirely free-form. You can also upload an item's own image,
which overrides the bound product's image.

Feeding recipes reference products by the same identifiers, so the schedule that
calls for a nutrient lines up with the item you have in stock — connecting the
[cultivation layer](/docs/grows-and-plants/) to what's on the shelf.
