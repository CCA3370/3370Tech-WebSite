'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface VersionDisplayProps {
  productSlug: string;
  defaultVersion?: string;
  githubRepo?: string;
}

export default function VersionDisplay({
  productSlug,
  defaultVersion = 'latest',
  githubRepo
}: VersionDisplayProps) {
  const t = useTranslations('product');
  const [version, setVersion] = useState<string>(defaultVersion);
  const [includePrerelease, setIncludePrerelease] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPrerelease, setIsPrerelease] = useState(false);

  useEffect(() => {
    if (!githubRepo) return;

    const fetchVersion = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/github-version?repo=${encodeURIComponent(githubRepo)}&includePrerelease=${includePrerelease}`
        );

        if (response.ok) {
          const data = await response.json();
          setVersion(data.version);
          setIsPrerelease(data.isPrerelease || false);
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
  }, [githubRepo, includePrerelease]);

  if (!githubRepo) {
    return (
      <p className="mt-2" style={{ color: 'var(--muted)' }}>
        {t('version')}: {version}
      </p>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-3">
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
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includePrerelease}
          onChange={(e) => setIncludePrerelease(e.target.checked)}
          className="w-4 h-4 rounded cursor-pointer"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="text-sm" style={{ color: 'var(--muted)' }}>
          {t('includePrerelease')}
        </span>
      </label>
    </div>
  );
}
