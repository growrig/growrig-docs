---
title: Safety & security
description: The layered responsibilities that keep physical grow equipment safe.
sidebar:
  order: 14
---

GrowRig controls physical equipment, so safety and security are architectural
requirements — not features added later. Responsibility is split across layers, each
with an explicit job.

## Safety layers

**Electrical & mechanical** — future hardware should include fusing, reverse-polarity
protection, current limits, transient protection, thermal design, certified external
mains switching, and moisture-aware enclosures.

**Controller firmware** — enforces safe boot outputs, watchdog behavior, command
timeout, fallback fan speed, maximum pump runtime, minimum ventilation, sensor-loss
behavior, and emergency-temperature behavior.

**Grow Core** — enforces target limits, stale-sensor detection, conflicting-actuator
prevention, override expiration, policy validation, alerting, and an audit history.

**User interface** — always shows *why* an output changed: which policy is active,
whether control is local or remote, whether a fallback is active, which sensor caused
an action, and when a manual override expires.

## Network security

Grow devices sit behind a Grow Gateway. Default assumptions: cameras and IoT devices
are untrusted, devices don't need home-LAN access, internet access is denied unless
explicitly required, and the Hub is the main user-facing endpoint.

## Device identity

The direction is unique identity per controller, per-device credentials, restricted
MQTT permissions, secure pairing, signed firmware, and rollback-safe OTA. The prototype
may start with simpler LAN credentials, but protocols should not assume one global
password forever.

## Data privacy

By default, measurements and photos stay on the Hub, no cloud account is required,
remote access is optional, and hosted notifications receive minimal data.

## Responsible use

GrowRig does not present environmental target values as guaranteed agricultural
advice. Recipes must declare their origin, version, verification status, and
assumptions.
