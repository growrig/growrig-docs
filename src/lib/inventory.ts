import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { resolveCatalogDir } from './catalog-paths';

/** Resolve the catalog inventory directory. */
function resolveInventoryRoot(): string {
  return resolveCatalogDir('inventory', 'GROWRIG_INVENTORY_DIR');
}

export interface Column {
  key: string;
  label: string;
  type: string;
  options?: string[];
}

export interface Variant {
  size: string;
  code?: string;
}

export interface InventoryProduct {
  category: string;
  slug: string; // product id, unique within its category
  name: string;
  brand?: string;
  description?: string;
  image?: string;
  attributes: Record<string, string>;
  variants: Variant[];
}

export interface ProductCategoryMeta {
  slug: string;
  label: string;
  description: string;
  icon: string;
  order: number;
  units: string[];
  columns: Column[];
}

export interface ProductCategory extends ProductCategoryMeta {
  products: InventoryProduct[];
}

let cache: ProductCategory[] | null = null;

function toDataUri(categoryPath: string, filename?: string): string | undefined {
  if (!filename) return undefined;
  const imagePath = path.join(categoryPath, filename);
  if (!existsSync(imagePath)) return undefined;
  const ext = path.extname(filename).toLowerCase();
  const mime =
    ext === '.svg'
      ? 'image/svg+xml'
      : ext === '.png'
        ? 'image/png'
        : ext === '.webp'
          ? 'image/webp'
          : ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : undefined;
  return mime ? `data:${mime};base64,${readFileSync(imagePath).toString('base64')}` : undefined;
}

/** Read every category `inventory.yaml` and its optional `products.yaml`. */
export function loadProductCategories(): ProductCategory[] {
  if (!import.meta.env.DEV && cache) return cache;

  const root = resolveInventoryRoot();
  const categories: ProductCategory[] = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const categorySlug = entry.name;
    const categoryPath = path.join(root, categorySlug);

    const metaPath = path.join(categoryPath, 'inventory.yaml');
    if (!existsSync(metaPath)) continue;
    const meta = parseYaml(readFileSync(metaPath, 'utf8')) ?? {};

    const productsPath = path.join(categoryPath, 'products.yaml');
    const productsData = existsSync(productsPath)
      ? (parseYaml(readFileSync(productsPath, 'utf8')) ?? {})
      : {};
    const rawProducts: any[] = Array.isArray(productsData.products) ? productsData.products : [];
    if (rawProducts.length === 0) continue; // catalog only lists categories with products

    const products: InventoryProduct[] = rawProducts.map((item) => {
      const attributes: Record<string, string> = {};
      for (const [key, value] of Object.entries(item.attributes ?? {})) {
        if (value != null) attributes[key] = String(value);
      }
      const variants: Variant[] = (Array.isArray(item.variants) ? item.variants : []).map(
        (variant: any) =>
          typeof variant === 'string'
            ? { size: variant }
            : { size: String(variant.size ?? ''), code: variant.code ? String(variant.code) : undefined },
      );
      return {
        category: categorySlug,
        slug: String(item.id),
        name: String(item.name ?? item.id),
        brand: attributes.brand,
        description: item.description ? String(item.description).trim() : undefined,
        image: toDataUri(categoryPath, item.image),
        attributes,
        variants,
      };
    });

    products.sort((a, b) => a.name.localeCompare(b.name));

    categories.push({
      slug: categorySlug,
      label: String(meta.label ?? categorySlug),
      description: String(meta.description ?? ''),
      icon: String(meta.icon ?? 'box'),
      order: Number(meta.order ?? 99),
      units: Array.isArray(meta.units) ? meta.units.map(String) : [],
      columns: (Array.isArray(meta.columns) ? meta.columns : []) as Column[],
      products,
    });
  }

  categories.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  if (!import.meta.env.DEV) cache = categories;
  return categories;
}

export function allInventoryProducts(): InventoryProduct[] {
  return loadProductCategories().flatMap((c) => c.products);
}

/** Number of buyable pack sizes represented by a product card. */
export function productVariantCount(product: InventoryProduct): number {
  return product.variants.length || 1;
}

export function categoryProductCount(category: ProductCategory): number {
  return category.products.reduce((total, product) => total + productVariantCount(product), 0);
}

export function totalProductCount(): number {
  return loadProductCategories().reduce((total, category) => total + categoryProductCount(category), 0);
}

export function findProductCategory(slug: string): ProductCategory | undefined {
  return loadProductCategories().find((c) => c.slug === slug);
}

/** The category column used to bucket/filter products (first enum column). */
export function primaryColumn(category: ProductCategory): Column | undefined {
  return category.columns.find((column) => column.type === 'enum' && (column.options?.length ?? 0) > 0);
}

/** Human label for a column enum value, falling back to the raw value. */
export function attributeLabel(value: string): string {
  return value.replace(/[-_]/g, ' ').replace(/^./, (c) => c.toUpperCase());
}
