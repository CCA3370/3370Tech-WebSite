'use client';

import { useState, useEffect, useRef } from 'react';
import { Download, ChevronDown, ExternalLink, Monitor, Apple, Terminal } from 'lucide-react';
import { DownloadLinks } from '@/types/product';
import { useLocale } from 'next-intl';
import { isValidLocale, type Locale } from '@/i18n/routing';

type UserOS = 'windows' | 'mac' | 'linux' | 'unknown';

function detectOS(): UserOS {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac') || ua.includes('darwin')) return 'mac';
  if (ua.includes('linux') && !ua.includes('android')) return 'linux';
  return 'unknown';
}

interface SmartDownloadButtonProps {
  download: DownloadLinks;
  productName: string;
  available?: boolean;
  githubRepo?: string;
  productSlug?: string;
  onDownloaded?: () => void;
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
    productNotAvailable: '暂不提供下载',
    portable: '便携版',
    installer: '安装版',
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
    productNotAvailable: 'Not Available',
    portable: 'Portable',
    installer: 'Installer',
  },
};

export default function SmartDownloadButton({ download, productName, available = true, githubRepo, productSlug, onDownloaded }: SmartDownloadButtonProps) {
  const rawLocale = useLocale();
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : 'en';
  const t = translations[locale];

  const [isChina, setIsChina] = useState<boolean | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userOS, setUserOS] = useState<UserOS>('unknown');
  const [version, setVersion] = useState<string>('1.0.0');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPlaceholder = download.xplaneOrg.includes('TODO_');

  // 将 URL 模板中的 {version} 替换为实际版本号
  const resolveUrl = (url: string) => url.replace('{version}', version);

  useEffect(() => {
    const detectRegion = async () => {
      let detectedIsChina = false;

      // 方案1：首先尝试使用更可靠的客户端地理位置API（精准度最高）
      try {
        // 如果浏览器支持Geolocation API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              // 调用服务端API，基于坐标判断是否在中国
              try {
                const response = await fetch('/api/geo', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ latitude, longitude })
                });
                const data = await response.json();
                setIsChina(data.isChina);
                setIsLoading(false);
              } catch {
                // 坐标定位失败，降级到其他方案
                fallbackDetection();
              }
            },
            () => {
              // 用户拒绝地理定位或不支持，使用降级方案
              fallbackDetection();
            },
            { timeout: 3000 } // 3秒超时
          );
        } else {
          fallbackDetection();
        }
      } catch {
        fallbackDetection();
      }

      async function fallbackDetection() {
        try {
          // 方案2：使用服务端CDN头检测
          const response = await fetch('/api/geo');
          const data = await response.json();
          detectedIsChina = data.isChina;
        } catch {
          // 方案3：客户端浏览器信息备选
          detectedIsChina = isClientInChina();
        } finally {
          setIsChina(detectedIsChina);
          setIsLoading(false);
        }
      }

      // 客户端检测函数
      function isClientInChina(): boolean {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language || navigator.languages?.[0];

        const chinaTimezones = [
          'Asia/Shanghai',
          'Asia/Chongqing',
          'Asia/Harbin',
          'Asia/Urumqi',
          'Asia/Hong_Kong',
          'Asia/Taipei',
          'Asia/Macau'
        ];

        const chinaLanguages = ['zh', 'zh-CN', 'zh-Hans', 'yue', 'zh-Hant'];

        const isTimezoneChina = chinaTimezones.includes(timezone);
        const isLanguageChina = chinaLanguages.some(lang =>
          language?.startsWith(lang.split('-')[0])
        );

        return isTimezoneChina || isLanguageChina;
      }
    };

    detectRegion();
  }, []);

  useEffect(() => {
    setUserOS(detectOS());
  }, []);

  // 从 GitHub API 获取版本号，用于构建 CDN 下载链接
  useEffect(() => {
    if (!githubRepo) return;
    const fetchVersion = async () => {
      try {
        const response = await fetch(`/api/github-version?repo=${encodeURIComponent(githubRepo)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.version) setVersion(data.version);
        }
      } catch {
        // 版本获取失败，保持 'latest'
      }
    };
    fetchVersion();
  }, [githubRepo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // CDN按钮点击：只有中国用户可用，根据系统弹出不同选项
  const handleCdnDownload = async () => {

    if (!isChina) return;

    // 统计下载
    if (productSlug) {
      try {
        await fetch(`/api/download-count/${productSlug}`, { method: 'POST' });
        if (onDownloaded) onDownloaded();
      } catch {}
    }

    if (download.cdnPlatform) {
      // Mac 直接下载
      if (userOS === 'mac' && download.cdnPlatform.mac) {
        window.open(resolveUrl(download.cdnPlatform.mac), '_blank');
        return;
      }
      // Windows/Linux/未知系统：打开下拉菜单选择
      setIsDropdownOpen(!isDropdownOpen);
      return;
    }

    // 无平台特定下载：直接下载通用CDN链接
    window.open(download.cdn, '_blank');
  };

  // X-Plane.org下载
  const handleXplaneOrgDownload = async () => {
    if (!isPlaceholder) {
      // 统计下载
      if (productSlug) {
        try {
          await fetch(`/api/download-count/${productSlug}`, { method: 'POST' });
          if (onDownloaded) onDownloaded();
        } catch {}
      }
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

  if (!available) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base opacity-50 cursor-not-allowed"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}>
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="whitespace-nowrap">{t.productNotAvailable}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-stretch">
        {isChina ? (
          <>
            {/* 中国用户：CDN按钮 + 下拉选择 */}
            <button
              onClick={handleCdnDownload}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-medium transition-all duration-200 text-sm sm:text-base rounded-l-full hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
              }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">{t.download}</span>
            </button>

            {/* 下拉箭头 */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center px-3 sm:px-4 rounded-r-full border-l border-white/20 transition-all duration-200 hover:bg-white/10 active:bg-white/20"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
              }}
              aria-label={t.moreOptions}
            >
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </>
        ) : (
          /* 非中国用户：直接X-Plane.org下载 */
          <button
            onClick={handleXplaneOrgDownload}
            disabled={isPlaceholder}
            className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-medium transition-all duration-200 text-sm sm:text-base rounded-full ${
              isPlaceholder
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-[1.02] active:scale-[0.98]'
            }`}
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">{locale === 'zh' ? '下载' : 'Download'}</span>
            {isPlaceholder && (
              <span className="text-xs opacity-75 hidden sm:inline">({t.placeholder})</span>
            )}
          </button>
        )}
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
          {/* 平台特定 CDN 下载选项 */}
          {isChina && download.cdnPlatform && (userOS === 'windows' || userOS === 'unknown') && download.cdnPlatform.win && (
            <>
              <button
                onClick={() => { window.open(resolveUrl(download.cdnPlatform!.win!.portable), '_blank'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base hover:bg-black/5 active:bg-black/10"
                style={{ color: 'var(--foreground)' }}
              >
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
                <div className="flex-1">
                  <div className="font-medium">Windows {t.portable}</div>
                </div>
              </button>
              <button
                onClick={() => { window.open(resolveUrl(download.cdnPlatform!.win!.installer), '_blank'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base hover:bg-black/5 active:bg-black/10"
                style={{ color: 'var(--foreground)' }}
              >
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
                <div className="flex-1">
                  <div className="font-medium">Windows {t.installer}</div>
                </div>
              </button>
            </>
          )}

          {isChina && download.cdnPlatform && userOS === 'unknown' && download.cdnPlatform.mac && (
            <button
              onClick={() => { window.open(resolveUrl(download.cdnPlatform!.mac!), '_blank'); setIsDropdownOpen(false); }}
              className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base hover:bg-black/5 active:bg-black/10"
              style={{ color: 'var(--foreground)' }}
            >
              <Apple className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
              <div className="flex-1">
                <div className="font-medium">macOS</div>
              </div>
            </button>
          )}

          {isChina && download.cdnPlatform && (userOS === 'linux' || userOS === 'unknown') && download.cdnPlatform.linux && (
            <>
              <button
                onClick={() => { window.open(resolveUrl(download.cdnPlatform!.linux!.appimage), '_blank'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base hover:bg-black/5 active:bg-black/10"
                style={{ color: 'var(--foreground)' }}
              >
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
                <div className="flex-1">
                  <div className="font-medium">Linux AppImage</div>
                </div>
              </button>
              <button
                onClick={() => { window.open(resolveUrl(download.cdnPlatform!.linux!.rpm), '_blank'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base hover:bg-black/5 active:bg-black/10"
                style={{ color: 'var(--foreground)' }}
              >
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
                <div className="flex-1">
                  <div className="font-medium">Linux RPM</div>
                </div>
              </button>
              <button
                onClick={() => { window.open(resolveUrl(download.cdnPlatform!.linux!.deb), '_blank'); setIsDropdownOpen(false); }}
                className="w-full flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all duration-200 text-sm sm:text-base hover:bg-black/5 active:bg-black/10"
                style={{ color: 'var(--foreground)' }}
              >
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--muted)' }} />
                <div className="flex-1">
                  <div className="font-medium">Linux DEB</div>
                </div>
              </button>
            </>
          )}

          {/* 分隔线 */}
          {isChina && download.cdnPlatform && (
            <div className="mx-4 border-t" style={{ borderColor: 'var(--border)' }} />
          )}

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
        {t.downloadFrom}: {isChina ? t.cdn : t.xplaneOrg}
        {isChina && !isPlaceholder && (
          <span className="ml-2 opacity-75 hidden sm:inline">
            ({t.xplaneOrg} {locale === 'zh' ? '可选' : 'available'})
          </span>
        )}
      </div>
    </div>
  );
}
