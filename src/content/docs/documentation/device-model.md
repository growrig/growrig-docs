---
title: The device model
description: How GrowRig describes devices as semantic capabilities and roles instead of brands.
sidebar:
  order: 4
---

GrowRig models **capabilities, not brands**. A device profile declares what a device
*provides* in semantic terms, and the user maps those capabilities to **roles** in
their environment. This is what makes hardware replaceable: swap a fan for a different
one that provides the same capability, and the role mapping still holds.

## Capabilities

A capability is a semantic feature a device exposes. For example:

```text
fan.speed
fan.rpm
sensor.temperature
sensor.humidity
switch.binary
display.status
```

In a profile, capabilities are listed under `provides`, each with a `label`, a `kind`,
and — where relevant — the Home Assistant `entityDomain`, a `measurement`, and a
`deviceClass`.

## Roles

A **role** is the purpose assigned to a capability inside an environment — for
example `exhaust`, `intake`, `circulation`, `main temperature sensor`, `humidifier`,
or `irrigation pump`. The user assigns roles during setup; Grow Core then reasons about
roles, not entity IDs.

```yaml
device:
  id: controller-a13f
  type: grow-controller
capabilities:
  - fan.speed
  - fan.rpm
  - sensor.temperature
channels:
  - id: fan1
    role: exhaust
  - id: fan2
    role: circulation
```

## Where profiles live

Each supported device has a profile at:

```text
growrig-platform/devices/<category>/<slug>/device.yaml
```

The directory path supplies the stable **category** and **slug**; the YAML supplies
brand, model, connection type, Home Assistant integration, and the semantic
capabilities. An optional `guide.md` beside it adds setup notes and limitations.

These same definitions power the [supported-devices catalog](/devices/) on this site.
To add one, see [Adding a device](/documentation/adding-a-device/).

## Policy model

Longer term, Grow Core sends the controller a **versioned policy** describing limits,
schedules, and fallback rules, which the controller acknowledges and stores:

```yaml
policy:
  id: main-box
  version: 42
channels:
  fan1:
    minimum: 20
    maximum: 100
    fallback: 50
safety:
  command_timeout: 60s
  emergency_temperature: 35
  emergency_fan_speed: 100
```
