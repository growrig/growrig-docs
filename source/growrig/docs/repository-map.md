# Repository map

## Initial repositories

### `growrig`

Purpose:

- project entry point;
- concept;
- architecture;
- roadmap;
- governance;
- design decisions.

This repository should remain mostly documentation.

### `growrig-platform`

Expected contents:

```text
growrig-platform/
├── growcore/
├── web/
├── api/
├── ha-app/
├── ha-integration/
├── simulator/
├── deployments/
└── tests/
```

### `growrig-firmware`

Expected contents:

```text
growrig-firmware/
├── packages/
├── boards/
├── components/
├── manifests/
├── tests/
└── docs/
```

## Later repositories

### `growrig-mobile`

Flutter mobile application.

### `growrig-hardware`

Stable PCB, enclosure, and manufacturing sources.

This should be created only when breadboard prototypes are sufficiently proven.

### `growrig-gateway`

OpenWrt configuration, firewall defaults, onboarding, and later gateway hardware.

### `growrig-catalog`

Hardware profiles and compatibility data.

### `growrig-recipes`

Versioned official and community recipes.

## Split criteria

Create a separate repository when at least one is true:

- it has a distinct release lifecycle;
- it has a distinct toolchain;
- it targets different contributors;
- it produces independently versioned artifacts;
- it requires separate security or compatibility testing.

Avoid creating empty repositories only for organizational symmetry.
