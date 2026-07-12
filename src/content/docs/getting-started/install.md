---
title: Install on Home Assistant
description: Install Grow Core as a local Home Assistant OS add-on.
sidebar:
  order: 2
---

Grow Core ships as a **local Home Assistant OS add-on**. It reaches Home Assistant
through the Supervisor proxy — no long-lived token needed — and serves the Grow App
dashboard directly.

## Build the add-on

From the platform repository, cross-compile the architecture-matched binaries:

```bash
make addon        # builds growcore.{aarch64,amd64,armv7}
```

## Install on your Hub

1. Copy the `addon/growrig/` folder onto your HAOS host's `addons` share
   (`/addons/growrig/`).
2. In Home Assistant, open **Settings → Add-ons → Add-on Store → ⋮ → Check for
   updates**.
3. Install **GrowRig — Grow Core** from *Local add-ons*.

The add-on serves the dashboard on host port `8099` by default.

## Choosing a mode

The same Grow Core binary runs in three modes, selected by the config file:

| Config | Mode | Home Assistant connection |
| --- | --- | --- |
| `growcore.yaml` | **Default — HAOS add-on** | Supervisor proxy (no token) |
| `growcore.dev.yaml` | Local dev against remote HA | `http://homeassistant.local:8123` + long-lived token |
| `growcore.sim.yaml` | Offline simulator | none |

For local development against your own Home Assistant instance:

```bash
export GROWCORE_HA_TOKEN=eyJ...          # HA → Profile → Long-lived access tokens
go run ./cmd/growcore -config growcore.dev.yaml
```

`${ENV_VAR}` references in the config are expanded at load, so tokens stay out of
version control. See [Configuration](/documentation/configuration/) for the full
reference.
