---
title: Configuration
description: Grow Core's YAML configuration modes and its HTTP + WebSocket API.
sidebar:
  order: 6
---

Grow Core is configured with YAML. The **same binary** runs in three modes, selected
by `adapter.type` and the config file you pass with `-config`.

## Modes

| File | Mode | Home Assistant |
| --- | --- | --- |
| `growcore.yaml` | Default — HAOS add-on | Supervisor proxy (`http://supervisor/core`, `$SUPERVISOR_TOKEN`) |
| `growcore.dev.yaml` | Local dev vs. remote HA | `http://homeassistant.local:8123` + long-lived token |
| `growcore.sim.yaml` | Offline simulator | none |

`${ENV_VAR}` references are expanded at load, so secrets stay out of version control:

```bash
export GROWCORE_HA_TOKEN=eyJ...          # HA → Profile → Long-lived access tokens
go run ./cmd/growcore -config growcore.dev.yaml
```

The config declares environments, devices, and how each device's sensors and fan
channels bind to Home Assistant entities. Running with no config file uses the
built-in simulator defaults.

### Flags

- `-config growcore.yaml` — config path.
- `-addr :8080` — overrides `server.addr`.

All other settings — storage path, control interval, adapter — come from the config
file.

## API

Base URL `http://localhost:8080`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness probe |
| `GET` | `/api/state` | Latest full snapshot |
| `GET` | `/api/roles` | Assignable channel roles |
| `GET` | `/api/environments` | List environments |
| `PUT` | `/api/environments/{id}/targets` | Set `{targetTempC, targetHumidity}` |
| `GET` | `/api/environments/{id}/history?limit=120` | Climate history (oldest first) |
| `GET` | `/api/devices` | Devices with live values + roles |
| `PUT` | `/api/devices/{id}/channels/{ch}/role` | Assign `{role}` to a channel |
| `GET` | `/api/ws` | WebSocket: streams a snapshot each control tick |

The WebSocket at `/api/ws` streams the full system snapshot every control tick, which
is what drives the live dashboard.
