import { getTranslations } from 'next-intl/server';
import SocialLinks from '@/components/SocialLinks';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center space-y-8">
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ color: 'var(--foreground)' }}
          >
            {t('title')}
          </h1>

          <div
            className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white text-5xl transition-all duration-300"
            style={{
              background: 'var(--button-primary-bg)',
              boxShadow: `0 10px 30px var(--shadow)`
            }}
          >
            👋
          </div>

          <div className="prose prose-lg mx-auto">
            <p
              className="text-xl leading-relaxed"
              style={{ color: 'var(--foreground)' }}
            >
              {t('description')}
            </p>

            <div
              className="mt-12 p-8 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: 'var(--card-bg)',
                boxShadow: `0 10px 30px var(--shadow)`
              }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                {t('contact')}
              </h2>
              <p className="mb-2" style={{ color: 'var(--muted)' }}>
                Email: {t('email')}
              </p>
              <p style={{ color: 'var(--muted)' }}>
                Location: {t('location')}
              </p>
            </div>

            <div className="mt-12">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: 'var(--foreground)' }}
              >
                {t('followUs')}
              </h2>
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
