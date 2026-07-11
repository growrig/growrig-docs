---
title: Documentation workflow
description: How hand-written and generated GrowRig documentation fit together.
---

The documentation has three sources:

1. **Hand-written docs-site pages** for navigation, onboarding, and contribution instructions.
2. **Project reference docs** copied from the `growrig` repository.
3. **Device reference docs** generated from `growrig-platform/devices`.

## Local repository layout

```text
workspace/
├── growrig/
├── growrig-platform/
└── growrig-docs/
```

With that layout, the generators discover sibling repositories automatically.

You can override discovery explicitly:

```bash
GROWRIG_SOURCE_DIR=/path/to/growrig \
GROWRIG_DEVICES_DIR=/path/to/growrig-platform/devices \
npm run dev
```

For a standalone demonstration, this MVP includes snapshots under `source/`. CI replaces them by checking out the current upstream repositories into those paths.
