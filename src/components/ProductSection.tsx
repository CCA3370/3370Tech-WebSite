'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Product } from '@/types/product';
import { ArrowRight, Download } from 'lucide-react';
import { isValidLocale, type Locale } from '@/i18n/routing';

interface ProductSectionProps {
  product: Product;
  index: number;
}

export default function ProductSection({ product, index }: ProductSectionProps) {
  const rawLocale = useLocale();
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'zh';
  const t = useTranslations('home');
  const isReversed = index % 2 !== 0;

  return (
    <div className="section flex items-center justify-center min-h-screen px-6 py-16">
      <div className="container mx-auto max-w-6xl w-full">
        {/* Bento Grid Layout - Large rounded cards */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-6 items-center">

          {/* Card 1: Main Info (Span 7 cols on desktop, full width on mobile) */}
          <div className={`lg:col-span-7 bento-card p-8 lg:p-10 flex flex-col justify-between ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="space-y-6">
              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold tracking-wide text-neutral-400 uppercase">Product</span>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-primary">
                  {product.name[locale]}
                </h2>
              </div>

              <p className="text-xl text-muted leading-relaxed max-w-xl">
                {product.description[locale]}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-tag-bg text-tag-text uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 mt-auto">
              <Link
                href={`/${locale}/products/${product.slug}`}
                className="btn-primary w-full sm:w-auto"
              >
                {t('learnMore')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/products/${product.slug}`}
                className="btn-secondary w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                {t('quickDownload')}
              </Link>
            </div>
          </div>

          {/* Card 2: Visual Hero (Span 5 cols) - Hidden on mobile */}
          <div className={`hidden lg:block lg:col-span-5 bento-card bento-image-wrapper p-6 lg:p-8 flex items-center justify-center min-h-[320px] lg:min-h-[400px] bg-white/50 backdrop-blur-sm ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
             <Image
              src={product.image}
              alt={product.name[locale]}
              width={500}
              height={500}
              className="object-contain w-full h-full drop-shadow-xl transition-transform duration-500 ease-out hover:scale-105"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
