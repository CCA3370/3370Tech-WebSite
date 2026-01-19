'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import SmartDownloadButton from '@/components/SmartDownloadButton';
import VersionDisplay from '@/components/VersionDisplay';
import { Product } from '@/types/product';
import { type Locale } from '@/i18n/routing';

interface ProductDetailClientProps {
  product: Product;
  locale: Locale;
  translations: {
    backToHome: string;
    features: string;
  };
}

export default function ProductDetailClient({ product, locale, translations: t }: ProductDetailClientProps) {
  const [visibleFeatures, setVisibleFeatures] = useState<Set<number>>(new Set());
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    featureRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setVisibleFeatures((prev) => new Set(prev).add(index));
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
          }
        );

        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 mb-8 sm:mb-10 text-sm sm:text-base transition-colors duration-200 group"
            style={{ color: 'var(--muted)' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            <span className="group-hover:text-[var(--foreground)]">{t.backToHome}</span>
          </Link>

          {/* Hero Section - Centered */}
          <div className="text-center mb-10 sm:mb-12">
            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-4"
              style={{ color: 'var(--foreground)' }}
            >
              {product.name[locale]}
            </h1>

            <VersionDisplay
              productSlug={product.slug}
              defaultVersion={product.version}
              githubRepo={product.githubRepo}
            />

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: '#faf8f5',
                      color: 'var(--foreground)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <p
              className="text-lg sm:text-xl leading-relaxed mt-6 max-w-2xl mx-auto"
              style={{ color: 'var(--muted)' }}
            >
              {product.longDescription[locale]}
            </p>

            {/* Download Button */}
            <div className="mt-8">
              <div className="w-full max-w-sm mx-auto">
                <SmartDownloadButton
                  download={product.download}
                  productName={product.name[locale]}
                />
              </div>
            </div>
          </div>

          {/* Features Section - Bento Grid */}
          {product.features && product.features.length > 0 && (
            <div>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center"
                style={{ color: 'var(--foreground)' }}
              >
                {t.features}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.features.map((feature, index) => (
                  <div
                    key={`feature-${feature.en.slice(0, 20).replace(/\s+/g, '-')}`}
                    ref={(el) => {
                      featureRefs.current[index] = el;
                    }}
                    className={`rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-500 ${
                      visibleFeatures.has(index)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                    style={{
                      backgroundColor: '#fffcf8',
                      transitionDelay: visibleFeatures.has(index) ? `${(index % 3) * 80}ms` : '0ms',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Check Icon */}
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: '#e8a87c' }}
                      >
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>

                      <span
                        className="text-base leading-relaxed"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {feature[locale]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
