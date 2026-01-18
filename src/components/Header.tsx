'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-4 md:top-6 left-0 right-0 z-50 transition-all duration-300"
    >
      {/* Floating Pill Header - Bento Style */}
      <nav className="container mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-sm rounded-full max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:bg-white/90">
          <Link
            href={`/${locale}`}
            className="text-lg md:text-xl font-bold hover:opacity-80 transition-opacity text-foreground hover:text-primary"
          >
            3370Tech
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:bg-black/5 active:scale-95"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-black/70" />
              ) : (
                <Menu className="w-5 h-5 text-black/70" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 mx-4 bg-white/95 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden animate-fade-in">
            <div className="flex flex-col py-2">
              <Link
                href={`/${locale}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-base font-medium text-black/70 hover:text-black hover:bg-black/5 transition-all active:bg-black/10"
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/about`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 text-base font-medium text-black/70 hover:text-black hover:bg-black/5 transition-all active:bg-black/10"
              >
                {t('about')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
