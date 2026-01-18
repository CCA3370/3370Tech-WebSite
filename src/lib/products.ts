import productsData from '@/data/products.json';
import { Product, ProductsData } from '@/types/product';

export function getAllProducts(): Product[] {
  return (productsData as ProductsData).products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return getAllProducts().find(product => product.slug === slug);
}

export function getProductSlugs(): string[] {
  return getAllProducts().map(product => product.slug);
}
