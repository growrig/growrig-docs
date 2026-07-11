---
title: Add a supported device
description: Create a device definition and let the documentation generator produce its catalog page.
---

Add devices to the platform repository using this layout:

```text
devices/
└── sensor/
    └── example-sensor/
        ├── device.yaml
        └── guide.md        # optional
```

## Minimum definition

```yaml
brand: Example
model: Environment Sensor
connection: ble
provides:
  - label: Temperature
    kind: sensor
    measurement: temperature
    entityDomain: sensor
    deviceClass: temperature
```

The generator requires `brand`, `model`, and `connection`. Each capability under `provides` requires `label` and `kind`.

## Optional fields

Current definitions may also use:

- `description`
- `version`
- `author`
- `haIntegration`
- `documentation`
- capability fields such as `measurement`, `entityDomain`, `deviceClass`, and `role`

Unknown fields are preserved in the YAML source and ignored by this MVP generator, allowing the platform schema to evolve without immediately breaking the docs site.

## Validate locally

```bash
npm run generate
npm run test:generated
npm run build
```
