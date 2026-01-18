'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, ChevronDown, ExternalLink } from 'lucide-react';
import { DownloadLinks } from '@/types/product';
import { useLocale } from 'next-intl';
import { isValidLocale, type Locale } from '@/i18n/routing';

interface SmartDownloadButtonProps {
  download: DownloadLinks;
  productName: string;
}

const translations = {
  zh: {
    download: '下载',
    downloadFrom: '下载自',
    cdn: 'CDN 高速下载',
    xplaneOrg: 'X-Plane.org',
    cdnRecommended: 'CDN 高速下载（推荐）',
    xplaneOrgAlt: '从 X-Plane.org 下载',
    notAvailable: '不可用',
    placeholder: '链接待添加',
  },
  en: {
    download: 'Download',
    downloadFrom: 'Download from',
    cdn: 'CDN Download',
    xplaneOrg: 'X-Plane.org',
    cdnRecommended: 'CDN Download (Recommended)',
    xplaneOrgAlt: 'Download from X-Plane.org',
    notAvailable: 'Not Available',
    placeholder: 'Link coming soon',
  },
};

export default function SmartDownloadButton({ download, productName }: SmartDownloadButtonProps) {
  const rawLocale = useLocale();
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'zh';
  const t = translations[locale];

  const [isChina, setIsChina] = useState<boolean | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPlaceholder = download.xplaneOrg.includes('TODO_');

  useEffect(() => {
    const detectRegion = async () => {
      try {
        const response = await fetch('/api/geo');
        const data = await response.json();
        setIsChina(data.isChina);
      } catch {
        // Fallback: use browser timezone to estimate
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const chinaTimezones = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin', 'Asia/Urumqi'];
        setIsChina(chinaTimezones.includes(timezone));
      } finally {
        setIsLoading(false);
      }
    };

    detectRegion();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainDownload = () => {
    if (isChina) {
      window.open(download.cdn, '_blank');
    } else if (!isPlaceholder) {
      window.open(download.xplaneOrg, '_blank');
    }
  };

  const handleAlternativeDownload = () => {
    if (isChina && !isPlaceholder) {
      window.open(download.xplaneOrg, '_blank');
    }
    setIsDropdownOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-8 py-4 rounded-full font-medium"
        style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const mainButtonDisabled = !isChina && isPlaceholder;
  const mainLabel = isChina ? t.cdn : t.xplaneOrg;
  const altLabel = isChina ? t.xplaneOrgAlt : t.cdn;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-stretch">
        {/* Main download button */}
        <button
          onClick={handleMainDownload}
          disabled={mainButtonDisabled}
          className={`flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-l-full font-medium transition-all duration-200 ${
            mainButtonDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
          style={{
            backgroundColor: isChina ? 'var(--accent)' : 'var(--button-primary-bg)',
            color: '#ffffff',
          }}
        >
          <Download className="w-5 h-5" />
          <span>{t.download}</span>
          {mainButtonDisabled && (
            <span className="text-xs opacity-75">({t.placeholder})</span>
          )}
        </button>

        {/* Dropdown toggle - only show for China users */}
        {isChina && (
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center px-4 rounded-r-full border-l border-white/20 transition-all duration-200 hover:bg-white/10"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
            aria-label="More download options"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}

        {/* For non-China: just round the right edge */}
        {!isChina && (
          <div
            className="w-4 rounded-r-full"
            style={{
              backgroundColor: mainButtonDisabled ? 'var(--button-primary-bg)' : 'var(--button-primary-bg)',
              opacity: mainButtonDisabled ? 0.5 : 1,
            }}
          />
        )}
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && isChina && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-lg z-50 animate-fade-in"
          style={{
            backgroundColor: 'var(--card-bg)',
            boxShadow: '0 10px 40px var(--shadow)',
          }}
        >
          <button
            onClick={handleAlternativeDownload}
            disabled={isPlaceholder}
            className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all duration-200 ${
              isPlaceholder
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-black/5'
            }`}
            style={{ color: 'var(--foreground)' }}
          >
            <ExternalLink className="w-5 h-5" style={{ color: 'var(--muted)' }} />
            <div className="flex-1">
              <div className="font-medium">{altLabel}</div>
              {isPlaceholder && (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {t.placeholder}
                </div>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Download source indicator */}
      <div className="mt-3 text-center text-sm" style={{ color: 'var(--muted)' }}>
        {t.downloadFrom}: {mainLabel}
        {isChina && !isPlaceholder && (
          <span className="ml-2 opacity-75">
            ({t.xplaneOrg} {locale === 'zh' ? '可选' : 'available'})
          </span>
        )}
      </div>
    </div>
  );
}
