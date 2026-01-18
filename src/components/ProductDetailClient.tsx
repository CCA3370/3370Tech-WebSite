'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
    <div className="relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="pt-28 sm:pt-32 md:pt-36 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-black/5 hover:border-black/10 transition-all duration-200 hover:gap-3 group text-sm sm:text-base shadow-sm hover:shadow"
            style={{ color: 'var(--foreground)' }}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
            <span>{t.backToHome}</span>
          </Link>

          {/* Hero Section - Full Width */}
          <div className="mb-8 sm:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-purple-500/10 border border-accent/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">Product</span>
              </div>

              {/* Product Icon - Large & Centered */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-purple-500/30 rounded-[2rem] blur-2xl"></div>
                <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-2xl">
                  <Image
                    src={product.image}
                    alt={product.name[locale]}
                    width={120}
                    height={120}
                    className="object-contain w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
                  />
                </div>
              </div>

              {/* Title & Version */}
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
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
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 rounded-full text-xs font-medium bg-white/60 backdrop-blur-sm border border-black/5 hover:border-accent/30 transition-all hover:scale-105"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-center max-w-3xl mx-auto mb-6 sm:mb-8" style={{ color: 'var(--muted)' }}>
              {product.longDescription[locale]}
            </p>

            {/* Download Button - Centered */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <SmartDownloadButton
                  download={product.download}
                  productName={product.name[locale]}
                />
              </div>
            </div>
          </div>

          {/* Features Section - Flat Cards */}
          {product.features && product.features.length > 0 && (
            <div>
              <div className="text-center mb-8 sm:mb-10">
                <h2
                  className="text-3xl sm:text-4xl font-bold mb-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  {t.features}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-accent to-purple-500 rounded-full mx-auto"></div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {product.features.map((feature, index) => (
                  <div
                    key={`feature-${feature.en.slice(0, 20).replace(/\s+/g, '-')}`}
                    ref={(el) => {
                      featureRefs.current[index] = el;
                    }}
                    className={`group relative bg-white/60 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-black/5 hover:border-accent/30 transition-all duration-500 hover:scale-[1.02] ${
                      visibleFeatures.has(index)
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: visibleFeatures.has(index) ? `${(index % 3) * 100}ms` : '0ms',
                    }}
                  >
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative flex items-start gap-3 sm:gap-4">
                      {/* Enhanced Check Icon */}
                      <div className="relative flex-shrink-0 mt-0.5">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-accent/30 rounded-xl blur-md group-hover:blur-lg transition-all"></div>

                        {/* Icon container */}
                        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-accent via-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/25 group-hover:shadow-accent/40 transition-all group-hover:scale-110">
                          {/* Check mark */}
                          <svg
                            className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>

                      <span className="text-base sm:text-lg leading-relaxed pt-0.5" style={{ color: 'var(--foreground)' }}>
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
