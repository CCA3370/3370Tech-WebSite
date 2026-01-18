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
    download: 'CDN 下载',
    downloadFrom: '下载来源',
    cdn: 'CDN 高速下载',
    xplaneOrg: 'X-Plane.org 官方下载',
    notAvailable: '不可用',
    placeholder: '链接待添加',
    moreOptions: '更多下载选项',
    cdnOnlyInChina: '仅限中国大陆可用',
  },
  en: {
    download: 'CDN Download',
    downloadFrom: 'Download Source',
    cdn: 'CDN Download',
    xplaneOrg: 'Official X-Plane.org',
    notAvailable: 'Not Available',
    placeholder: 'Link coming soon',
    moreOptions: 'More download options',
    cdnOnlyInChina: 'Available in China only',
  },
};

export default function SmartDownloadButton({ download, productName }: SmartDownloadButtonProps) {
  const rawLocale = useLocale();
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
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

  // CDN按钮点击：只有中国用户可用
  const handleCdnDownload = () => {
    if (isChina) {
      window.open(download.cdn, '_blank');
    }
  };

  // X-Plane.org下载
  const handleXplaneOrgDownload = () => {
    if (!isPlaceholder) {
      window.open(download.xplaneOrg, '_blank');
    }
    setIsDropdownOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium"
        style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // CDN按钮禁用条件：不在中国大陆
  const cdnDisabled = !isChina;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-stretch">
        {/* 主下载按钮 - 始终显示CDN */}
        <button
          onClick={handleCdnDownload}
          disabled={cdnDisabled}
          className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-medium transition-all duration-200 text-sm sm:text-base rounded-l-full ${
            cdnDisabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          }`}
          style={{
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
          }}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="whitespace-nowrap">{t.download}</span>
          {cdnDisabled && (
            <span className="text-xs opacity-75 hidden sm:inline">({t.cdnOnlyInChina})</span>
          )}
        </button>

        {/* 下拉箭头 - 始终显示 */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-center px-3 sm:px-4 rounded-r-full border-l border-white/20 transition-all duration-200 hover:bg-white/10 active:bg-white/20"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
          }}
          aria-label={t.moreOptions}
        >
          <ChevronDown
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* 下拉菜单 */}
      {isDropdownOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden shadow-lg z-50 animate-fade-in"
          style={{
            backgroundColor: 'var(--card-bg)',
            boxShadow: '0 10px 40px var(--shadow)',
          }}
        >
          <button
            onClick={handleXplaneOrgDownload}
            disabled={isPlaceholder}
            className={`w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base ${
              isPlaceholder
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-black/5 active:bg-black/10'
            }`}
            style={{ color: 'var(--foreground)' }}
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
            <div className="flex-1">
              <div className="font-medium">{t.xplaneOrg}</div>
              {isPlaceholder && (
                <div className="text-xs" style={{ color: 'var(--muted)' }}>
                  {t.placeholder}
                </div>
              )}
            </div>
          </button>
        </div>
      )}

      {/* 下载来源指示器 */}
      <div className="mt-2 sm:mt-3 text-center text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
        {t.downloadFrom}: {t.cdn}
        {!isPlaceholder && (
          <span className="ml-2 opacity-75 hidden sm:inline">
            ({t.xplaneOrg} {locale === 'zh' ? '可选' : 'available'})
          </span>
        )}
      </div>
    </div>
  );
}
