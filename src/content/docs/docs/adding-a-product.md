---
title: Adding a product
description: Contribute a built-in inventory product template to the GrowRig supported-products catalog.
sidebar:
  order: 12
---

The [supported-products catalog](/products/) is generated directly from product
definitions in the platform repository — the same way the
[devices catalog](/devices/) is generated from device profiles. A **product** is
a ready-made template for a real-world item that pre-fills a new inventory item
and stays bound to the definition. See [Inventory & products](/docs/inventory/)
for how templates, categories, and items relate.

## Pick the category

Products live in a category's `products.yaml`:

```text
growrig-platform/inventory/<category>/products.yaml
```

The **path** supplies the category (`consumables`, `plant-material`,
`equipment`, `supplies`, `harvest-storage`). Its sibling `inventory.yaml`
declares the category's **columns** — the attribute keys a product may set — and
its units. A product's `attributes` must use those declared keys; anything else
is dropped.

## Define the product

```yaml
# inventory/consumables/products.yaml
products:
  - id: biobizz-bio-grow
    image: images/biobizz-bio-grow.jpg
    name: BioBizz Bio·Grow
    description: Organic liquid growth fertilizer with sugar-beet extract.
    attributes: { kind: nutrient, brand: BioBizz }
    variants:
      - { size: 250 ml }
      - { size: 1 L }
      - { size: 5 L, code: "8710513320057" }
```

- **`id`** — unique within the category. Items bind to a product by
  `<category>/<id>`, so keep it stable once published.
- **`name`**, **`description`** — shown on the product page and on bound items.
- **`attributes`** — values keyed by the category's columns (e.g. `kind`,
  `brand`). Enum values must be one of the column's declared options.
- **`variants`** — the pack sizes the product sells in. Each has a `size` label
  and an optional `code` (SKU / barcode, typically distinct per size).
- **`image`** — optional, a path relative to the category directory. PNG, JPEG,
  and WebP all work; place the file (conventionally under `images/`) beside the
  YAML.

## Verify

Both Grow Core and this docs site read the same tree, so a new product appears in
its category automatically:

```bash
npm run dev
```

There is no separate generation step — the site reads the inventory definitions
directly at build time from the sibling `growrig-platform` repository (falling
back to the bundled snapshot in `source/`).
