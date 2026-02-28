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

  const { slug } = params;
  const data = readProducts();
  const product = data.products.find((p: any) => p.slug === slug);
  return NextResponse.json({ count: product && typeof product.count === 'number' ? product.count : 0 });
}

  const { slug } = params;
  const data = readProducts();
  const product = data.products.find((p: any) => p.slug === slug);
  if (product) {
    product.count = (typeof product.count === 'number' ? product.count : 0) + 1;
    writeProducts(data);
    return NextResponse.json({ count: product.count });
  } else {
    return NextResponse.json({ count: 0 }, { status: 404 });
  }
}
