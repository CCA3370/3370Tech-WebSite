'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Remove transition class when component mounts (after navigation completes)
  useEffect(() => {
    document.body.classList.remove('page-transitioning');
    setIsSwitching(false);
  }, [pathname]);

  const switchLanguage = useCallback(() => {
    if (isSwitching) return;

    setIsSwitching(true);
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);

    // Use CSS class for fade animation (SSR safe)
    if (typeof document !== 'undefined') {
      document.body.classList.add('page-transitioning');

      setTimeout(() => {
        router.push(newPath);
      }, 300);
    } else {
      router.push(newPath);
    }
  }, [isSwitching, locale, pathname, router]);

  return (
    <button
      onClick={switchLanguage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isSwitching}
      className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-black/5"
      aria-label="Switch language"
      style={{ color: isHovered ? 'var(--primary)' : 'var(--muted)' }}
    >
      <Globe 
        className="w-5 h-5 transition-transform duration-500 ease-in-out" 
        style={{
          transform: isSwitching ? 'rotate(360deg)' : (isHovered ? 'rotate(15deg)' : 'rotate(0deg)'),
        }} 
      />
    </button>
  );
}
