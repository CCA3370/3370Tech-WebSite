'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="py-8 mt-12 mb-4">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--muted)' }}>
          {t('copyright')}
        </p>
        <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
        <p className="text-xs font-light" style={{ color: 'var(--muted)' }}>
          {t('builtWith')}
        </p>
      </div>
    </footer>
  );
}
