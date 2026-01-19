'use client';

import { useTranslations } from 'next-intl';
import { getAllProducts } from '@/lib/products';
import FullPageWrapper from '@/components/FullPageWrapper';
import ProductSection from '@/components/ProductSection';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const t = useTranslations('home');
  const products = getAllProducts();
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);

  // Trigger animation for the first section after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSectionIndex(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle section change
  const handleSectionLeave = (_origin: unknown, destination: { index: number }) => {
    // Reset animation by briefly removing active state
    setActiveSectionIndex(null);
    setTimeout(() => {
      setActiveSectionIndex(destination.index);
    }, 50);
  };

  return (
    <>
      {/* Background Image - Restored for Flight Sim Vibe */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: 'url(/images/hero-background.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dynamic Overlay: Glass on Hero, White on Products */}
        <div
          className="absolute inset-0 transition-colors duration-700 ease-in-out"
          style={{
            backgroundColor: activeSectionIndex === 0
              ? 'rgba(255, 255, 255, 0.25)'
              : 'rgba(245, 245, 247, 0.65)'
          }}
        />
        {/* Glass Blur Effect for Hero */}
        <div
           className="absolute inset-0 transition-all duration-700"
           style={{
             backdropFilter: activeSectionIndex === 0 ? 'blur(6px)' : 'blur(20px)'
           }}
        />
      </div>

      {/* Content - Use fixed positioning to work independently of flex layout */}
      <div className="fixed inset-0 z-10 overflow-hidden">
        <FullPageWrapper onLeave={handleSectionLeave}>
          {() => (
            <div className="fullpage-wrapper">
              {/* Hero Section */}
              <div className="section flex items-center justify-center min-h-screen px-4 sm:px-6">
                <div
                  className={`text-center space-y-6 sm:space-y-8 max-w-3xl relative z-20 hero-content ${activeSectionIndex === 0 ? 'section-active' : ''}`}
                >
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-black mb-4 drop-shadow-lg leading-tight animate-item">
                    {t('hero.title')}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 max-w-2xl mx-auto leading-normal drop-shadow-md px-4 animate-item">
                    {t('hero.subtitle')}
                  </p>

                  <div className="pt-6 sm:pt-8 animate-item">
                     <span className="inline-flex items-center justify-center p-3 rounded-full bg-white/90 shadow-sm border border-black/5 text-primary animate-bounce backdrop-blur-sm">
                        <ChevronDown className="w-5 h-5" />
                     </span>
                  </div>
                </div>
              </div>

              {/* Product Sections */}
              {products.map((product, index) => (
                <ProductSection
                  key={product.id}
                  product={product}
                  index={index}
                  isActive={activeSectionIndex === index + 1}
                />
              ))}
            </div>
          )}
        </FullPageWrapper>
      </div>
    </>
  );
}
