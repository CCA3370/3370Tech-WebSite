import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { kv } from '@vercel/kv';
import { getProductBySlug } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const PRODUCTS_FILE = path.join(process.cwd(), 'src/data/products.json');
const hasRemoteCounterStore = Boolean(
  (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
  (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)
);
const canUseFileFallback = process.env.VERCEL !== '1';

type RouteParams = { slug?: string };
type RouteContext = { params: Promise<RouteParams> | RouteParams };
type ProductCounterRecord = {
  slug?: string;
  count?: number;
  [key: string]: unknown;
};
type ProductsFileData = {
  products?: ProductCounterRecord[];
  [key: string]: unknown;
};

function toNoStoreJson(payload: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  return NextResponse.json(payload, { ...init, headers });
}

function isValidSlug(slug: string) {
  return /^[a-z0-9-]+$/.test(slug);
}

function normalizeCount(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return null;
}

function readProductsFile(): ProductsFileData {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return { products: [] };
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw) as ProductsFileData;
  } catch {
    return { products: [] };
  }
}

function readCountFromFile(slug: string): number {
  const data = readProductsFile();
  const products = Array.isArray(data.products) ? data.products : [];
  const product = products.find((item) => item.slug === slug);
  return normalizeCount(product?.count) ?? 0;
}

function incrementCountInFile(slug: string): number {
  const data = readProductsFile();
  const products = Array.isArray(data.products) ? data.products : [];
  const index = products.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return 0;
  }

  const current = normalizeCount(products[index].count) ?? 0;
  const next = current + 1;
  products[index] = { ...products[index], count: next };
  data.products = products;
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf-8');

  return next;
}

function getCounterKey(slug: string) {
  return `download-count:${slug}`;
}

async function getOrSeedRemoteCount(slug: string): Promise<number> {
  const key = getCounterKey(slug);
  const existing = normalizeCount(await kv.get<number | string | null>(key));

  if (existing !== null) {
    return existing;
  }

  const seed = readCountFromFile(slug);
  await kv.set(key, seed, { nx: true });

  const updated = normalizeCount(await kv.get<number | string | null>(key));
  return updated ?? seed;
}

async function getSlugFromContext(context: RouteContext): Promise<string | null> {
  const params = await context.params;
  if (typeof params?.slug !== 'string') {
    return null;
  }
  return params.slug.trim();
}

function getStorageConfigErrorResponse() {
  return toNoStoreJson(
    {
      error: 'counter_store_not_configured',
      message: 'Configure Vercel Redis/KV environment variables for persistent download counts.',
    },
    { status: 503 }
  );
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const slug = await getSlugFromContext(context);

    if (!slug || !isValidSlug(slug)) {
      return toNoStoreJson({ error: 'invalid_slug' }, { status: 400 });
    }

    if (!getProductBySlug(slug)) {
      return toNoStoreJson({ error: 'not_found', count: 0 }, { status: 404 });
    }

    if (hasRemoteCounterStore) {
      const count = await getOrSeedRemoteCount(slug);
      return toNoStoreJson({ count });
    }

    if (canUseFileFallback) {
      return toNoStoreJson({ count: readCountFromFile(slug) });
    }

    return getStorageConfigErrorResponse();
  } catch (error) {
    console.error('GET /api/download-count/[slug] failed:', error);
    return toNoStoreJson({ error: 'failed' }, { status: 500 });
  }
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const slug = await getSlugFromContext(context);

    if (!slug || !isValidSlug(slug)) {
      return toNoStoreJson({ error: 'invalid_slug' }, { status: 400 });
    }

    if (!getProductBySlug(slug)) {
      return toNoStoreJson({ error: 'not_found', count: 0 }, { status: 404 });
    }

    if (hasRemoteCounterStore) {
      const key = getCounterKey(slug);
      await getOrSeedRemoteCount(slug);
      const next = normalizeCount(await kv.incr(key)) ?? 0;
      return toNoStoreJson({ count: next });
    }

    if (canUseFileFallback) {
      return toNoStoreJson({ count: incrementCountInFile(slug) });
    }

    return getStorageConfigErrorResponse();
  } catch (error) {
    console.error('POST /api/download-count/[slug] failed:', error);
    return toNoStoreJson({ error: 'failed' }, { status: 500 });
  }
}
