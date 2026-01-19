'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface VersionDisplayProps {
  productSlug: string;
  defaultVersion?: string;
  githubRepo?: string;
}

const translations = {
  zh: {
    stable: '稳定版',
  },
  en: {
    stable: 'Stable',
  },
};

export default function VersionDisplay({
  productSlug,
  defaultVersion = 'latest',
  githubRepo
}: VersionDisplayProps) {
  const t = useTranslations('product');
  const locale = useLocale() as 'zh' | 'en';
  const localT = translations[locale] || translations.en;

  const [version, setVersion] = useState<string>(defaultVersion);
  const [loading, setLoading] = useState(false);
  const [isPrerelease, setIsPrerelease] = useState(false);
  const [stableVersion, setStableVersion] = useState<string | null>(null);

  useEffect(() => {
    if (!githubRepo) return;

    const fetchVersion = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/github-version?repo=${encodeURIComponent(githubRepo)}`
        );

        if (response.ok) {
          const data = await response.json();
          setVersion(data.version);
          setIsPrerelease(data.isPrerelease || false);
          setStableVersion(data.stableVersion || null);
        } else {
          console.error('Failed to fetch version:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch version:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, [githubRepo]);

  if (!githubRepo) {
    return (
      <p className="mt-2" style={{ color: 'var(--muted)' }}>
        {t('version')}: {version}
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      <p style={{ color: 'var(--muted)' }}>
        {t('version')}: {loading ? '...' : version}
        {isPrerelease && (
          <span
            className="ml-2 px-3 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'white'
            }}
          >
            Pre-release
          </span>
        )}
      </p>
      {isPrerelease && stableVersion && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {localT.stable}: {stableVersion}
        </p>
      )}
    </div>
  );
}
