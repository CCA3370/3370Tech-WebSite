import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'src/data/products.json');

function readProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return { products: [] };
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
}

function writeProducts(data: any) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const data = readProducts();
    const product = data.products.find((p: any) => p.slug === slug);
    const count = product && typeof product.count === 'number' ? product.count : 0;
    return NextResponse.json({ count });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function POST(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const data = readProducts();
    const product = data.products.find((p: any) => p.slug === slug);
    if (product) {
      product.count = (typeof product.count === 'number' ? product.count : 0) + 1;
      writeProducts(data);
      return NextResponse.json({ count: product.count });
    }
    return NextResponse.json({ count: 0 }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
