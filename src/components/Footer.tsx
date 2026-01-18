'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="pt-2 pb-4">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <p className="text-sm font-medium tracking-wide" style={{ color: 'var(--muted)' }}>
          © 2026 3370Tech. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
