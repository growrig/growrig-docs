# Security and safety

GrowRig controls physical equipment. Safety and security are architectural requirements, not later features.

## Safety layers

### Electrical and mechanical

Future hardware should include:

- fusing;
- reverse-polarity protection;
- appropriate connectors;
- current limits;
- transient protection;
- thermal design;
- certified external mains switching;
- moisture-aware enclosures.

### Controller firmware

The Controller should enforce:

- safe boot outputs;
- watchdog behavior;
- command timeout;
- fallback fan speed;
- maximum pump runtime;
- minimum ventilation;
- sensor-loss behavior;
- emergency temperature behavior.

### Grow Core

Grow Core should enforce:

- target limits;
- stale sensor detection;
- conflicting actuator prevention;
- override expiration;
- policy validation;
- alerting;
- audit history.

### User interface

The UI should show:

- why an output changed;
- which policy is active;
- whether control is local or remote;
- whether a fallback is active;
- which sensor caused an action;
- whether a manual override expires.

## Network security

The recommended setup places grow devices behind a Grow Gateway.

Default assumptions:

- cameras and IoT devices are untrusted;
- devices do not need access to the home LAN;
- internet access is denied unless explicitly required;
- the Hub is the main user-facing endpoint.

## Device identity

Future direction:

- unique identity per controller;
- per-device credentials;
- restricted MQTT permissions;
- secure pairing;
- signed firmware;
- rollback-safe OTA;
- optional secure boot and flash encryption.

The prototype may start with simpler LAN credentials, but protocols should not assume one global password forever.

## Release security

Future releases should provide:

- signed firmware and container artifacts;
- SBOMs;
- build provenance;
- versioned hardware profiles;
- reproducible builds where practical;
- safe downgrade and rollback rules.

## Data privacy

By default:

- measurements stay on the Hub;
- photos stay on the Hub;
- no cloud account is required;
- remote access is optional;
- hosted notifications receive minimal data.

## Responsible use

GrowRig should not present environmental target values as guaranteed agricultural advice. Recipes must declare their origin, version, verification status, and assumptions.
