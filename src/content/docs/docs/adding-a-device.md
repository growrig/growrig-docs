---
title: Adding a device
description: Contribute a driver and its products to the GrowRig supported-devices catalog.
sidebar:
  order: 11
---

The [supported-devices catalog](/devices/) is generated directly from device
definitions in the platform repository. GrowRig distinguishes two things:

- a **driver** — how GrowRig binds to and controls a *class* of hardware
  (capabilities, Home Assistant integration, control defaults). Often "Generic".
- **products** — the concrete, buyable items a driver supports (a specific tent
  model, a specific fan). Many products usually share one driver.

The catalog lists **products**; each points back to the driver that powers it.

## Define the driver

A driver lives at:

```text
growrig-platform/devices/<category>/<driver-id>/device.yaml
```

The **path** supplies the category (`controller`, `sensor`, `fan`, `light`,
`plug`, `camera`, `tent`) and the driver id. The **YAML** supplies metadata,
capabilities, and the products it supports:

```yaml
brand: Generic
model: Grow tent
connection: n/a
description: A passive enclosure recorded for its air volume.
products:
  - id: mars-hydro-grow-tent-series
    vendor: mars-hydro
    brand: Mars Hydro
    model: Grow Tent Series
    models:
      - id: mars-hydro-2x2
        model: 2'×2' Grow Tent
        specs: { widthCm: 60, depthCm: 60, heightCm: 140 }
  - id: vivosun-4x4
    brand: VIVOSUN
    model: 4'×4' Grow Tent
    specs: { widthCm: 120, depthCm: 120, heightCm: 200 }
```

### Products and specs

Each entry under `products:` needs a unique `id` (unique within its category) and
usually a `brand` and `model`; it inherits the driver's brand/model when omitted.
An entry may be a simple product, or a series containing exact `models`. Series
metadata is written once; Grow Core flattens its models for exact selection while
the public catalogue shows one series card.

`specs` is a **free-form numeric map** — the key idea that makes this systematic.
Grow Core reads well-known keys where it needs them (fans use `sizeMm`, `maxRpm`,
`airflowCfm`, `staticPressureMmH2O`, `startingVoltage`, `ductSizeInches`,
`noiseDba`; tents use `widthCm`, `depthCm`, `heightCm`); every other key is shown
as display metadata. Add keys freely — no schema change required.

A driver with **no** `products:` is itself a single product, so simple one-off
devices stay a one-file definition.

A driver whose brand is `Generic` always remains visible as a generic catalogue
option, even when it also lists branded products or series. Do not duplicate it
inside `products`; the catalogue loader adds it automatically.

### Vendor and product artwork

Set `vendor` to a stable vendor id from `growrig-platform/vendors/<vendor-id>/`.
Each vendor directory contains `vendor.yaml` and may contain a reusable real logo. The
[vendor catalogue](/vendors/) and device pages both read those shared files.

Until a logo is provided, `color` and `background` in `vendor.yaml` render a
branded initials fallback. Add `logo: filename.svg` (PNG, JPEG, and WebP also
work) after placing the real artwork beside `vendor.yaml`.

Use `products[].images` when a product or series has multiple pictures. Each
entry has `src` and may have a `model` id associating it with an exact model.
Images without `model` apply to the whole series. The first image represents the
series on catalogue cards, and the complete set appears in the profile gallery.

### Capabilities

`provides` declares the driver's semantic capabilities and how they bind to Home
Assistant entities. See [the device model](/docs/device-model/) for how
capabilities and roles work.

## Add a setup guide (optional)

Drop a `guide.md` beside the `device.yaml` with setup steps, limitations, and
troubleshooting. Its content is rendered on the product page.

## Verify

Both Grow Core and this docs site read the same tree. Run the docs locally and the
new products appear in their category automatically:

```bash
npm run dev
```

There is no separate generation step — the site reads the device definitions
directly at build time from the sibling `growrig-platform` repository (falling
back to the bundled snapshot in `source/`).
