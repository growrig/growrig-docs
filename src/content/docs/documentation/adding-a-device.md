---
title: Adding a device
description: Contribute a device profile to the GrowRig supported-devices catalog.
sidebar:
  order: 7
---

The [supported-devices catalog](/devices/) is generated directly from device
profiles in the platform repository. Adding a device is a matter of adding one small
YAML file.

## Create the profile

A device is discovered at:

```text
growrig-platform/devices/<category>/<slug>/device.yaml
```

The **path** supplies the category (`controller`, `sensor`, `fan`, `light`, `plug`,
`camera`, `tent`) and the device slug. The **YAML** supplies the metadata and
capabilities:

```yaml
brand: TP-Link
model: Tapo P110 smart plug
connection: wifi
description: >-
  Compact Wi-Fi smart plug with remote switching and real-time energy monitoring.
version: 1.0.0
author: GrowRig
haIntegration: tplink
documentation: https://www.home-assistant.io/integrations/tplink/
provides:
  - label: On/off
    kind: power
    entityDomain: switch
  - label: Actual power
    kind: sensor
    measurement: power
    entityDomain: sensor
    deviceClass: power
```

### Required fields

- `brand`, `model`, `connection` — non-empty strings.
- `provides` — optional, but when present each entry needs a `label` and a `kind`.

Common `connection` values are `wifi`, `esphome`, `ble`, `zigbee`, `generic`, and
`n/a`. See [the device model](/documentation/device-model/) for how capabilities and
roles work.

## Add a setup guide (optional)

Drop a `guide.md` beside the `device.yaml` with setup steps, limitations, and
troubleshooting. Its content is rendered on the device's page, below the capabilities.

## Verify

Run the docs site locally; the new device appears in its category automatically:

```bash
npm run dev
```

There is no separate generation step — the site reads the device definitions directly
at build time from the sibling `growrig-platform` repository (falling back to the
bundled snapshot in `source/`).
