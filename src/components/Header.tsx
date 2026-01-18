'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();

  return (
    <header
      className="fixed top-6 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* Floating Pill Header - Bento Style */}
      <nav className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm rounded-full max-w-4xl mx-auto px-6 py-3 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:bg-white/90">
          <Link
            href={`/${locale}`}
          className="text-xl font-bold hover:opacity-80 transition-opacity text-foreground hover:text-primary"
        >
          3370Tech
        </Link>

          <div className="flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm font-medium text-black/70 hover:text-black transition-colors"
            >
              {t('about')}
            </Link>
            <div className="w-px h-4 bg-gray-300 mx-2"></div>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
