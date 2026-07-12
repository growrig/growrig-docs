---
title: Adding a device
description: Contribute a driver and its products to the GrowRig supported-devices catalog.
sidebar:
  order: 7
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
  - id: mars-hydro-2x2
    brand: Mars Hydro
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

`specs` is a **free-form numeric map** — the key idea that makes this systematic.
Grow Core reads well-known keys where it needs them (fans use `sizeMm`, `maxRpm`,
`airflowCfm`, `staticPressureMmH2O`, `startingVoltage`, `ductSizeInches`,
`noiseDba`; tents use `widthCm`, `depthCm`, `heightCm`); every other key is shown
as display metadata. Add keys freely — no schema change required.

A driver with **no** `products:` is itself a single product (e.g. the Tapo P110
smart plug), so simple one-off devices stay a one-file definition.

### Capabilities

`provides` declares the driver's semantic capabilities and how they bind to Home
Assistant entities. See [the device model](/documentation/device-model/) for how
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
