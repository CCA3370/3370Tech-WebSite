import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProductBySlug, getProductSlugs } from '@/lib/products';
import { isValidLocale, type Locale } from '@/i18n/routing';
import ProductDetailClient from '@/components/ProductDetailClient';

export function generateStaticParams() {
  const slugs = getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale: rawLocale } = await params;
  const product = getProductBySlug(slug);
  const t = await getTranslations('product');

  if (!product) {
    notFound();
  }

  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'zh';

  return (
    <ProductDetailClient
      product={product}
      locale={locale}
      translations={{
        backToHome: t('backToHome'),
        features: t('features'),
      }}
    />
  );
}
