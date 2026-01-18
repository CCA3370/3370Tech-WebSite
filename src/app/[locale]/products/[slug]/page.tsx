import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProductBySlug, getProductSlugs } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import SmartDownloadButton from '@/components/SmartDownloadButton';
import VersionDisplay from '@/components/VersionDisplay';
import { isValidLocale, type Locale } from '@/i18n/routing';

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
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 mb-8 transition-all duration-200 hover:opacity-80 animate-fade-in"
          style={{ color: 'var(--muted)' }}
        >
          <ArrowLeft className="w-5 h-5" />
          {t('backToHome')}
        </Link>

        {/* Product Header with Download */}
        <div className="space-y-8 mb-12 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div
              className="p-4 rounded-2xl transition-all duration-300 flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--card-bg)' }}
            >
              <Image
                src={product.image}
                alt={product.name[locale]}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1
                  className="text-4xl md:text-5xl font-bold"
                  style={{ color: 'var(--foreground)' }}
                >
                  {product.name[locale]}
                </h1>
                <VersionDisplay
                  productSlug={product.slug}
                  defaultVersion={product.version}
                  githubRepo={product.githubRepo}
                />
              </div>

              {/* Download Button - Now in header area */}
              <div className="max-w-sm">
                <SmartDownloadButton
                  download={product.download}
                  productName={product.name[locale]}
                />
              </div>
            </div>
          </div>

          <p className="text-xl animate-fade-in-delay" style={{ color: 'var(--foreground)' }}>
            {product.longDescription[locale]}
          </p>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div
            className="rounded-2xl p-8 transition-all duration-300 animate-slide-up-delay hover:shadow-2xl"
            style={{
              backgroundColor: 'var(--card-bg)',
              boxShadow: '0 10px 30px var(--shadow)'
            }}
          >
            <h2
              className="text-2xl font-bold mb-6"
              style={{ color: 'var(--foreground)' }}
            >
              {t('features')}
            </h2>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li
                  key={`feature-${feature.en.slice(0, 20).replace(/\s+/g, '-')}`}
                  className="flex items-start gap-3 animate-fade-in hover:translate-x-2 transition-transform duration-200"
                  style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
                >
                  <span className="mt-1" style={{ color: 'var(--accent)' }}>✓</span>
                  <span className="text-lg" style={{ color: 'var(--foreground)' }}>
                    {feature[locale]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
