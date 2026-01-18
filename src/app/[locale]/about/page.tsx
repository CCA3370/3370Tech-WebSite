import { getTranslations } from 'next-intl/server';
import SocialLinks from '@/components/SocialLinks';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="relative overflow-hidden">
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/3 left-1/2 w-96 h-96 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="pt-28 sm:pt-32 md:pt-36 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center flex flex-col items-center">
            {/* Badge - Enlarged */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 mb-12 sm:mb-16 animate-fade-in">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-base sm:text-lg font-semibold uppercase tracking-wider text-green-600">About Us</span>
            </div>

            {/* Avatar with Glow */}
            <div className="relative mb-8 sm:mb-10 animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto rounded-full flex items-center justify-center text-5xl sm:text-6xl shadow-2xl border-4 border-white/50" style={{ background: 'var(--button-primary-bg)' }}>
                👋
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border border-black/5 shadow-xl mb-8 sm:mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <p
                className="text-lg sm:text-xl md:text-2xl leading-relaxed"
                style={{ color: 'var(--foreground)' }}
              >
                {t('description')}
              </p>
            </div>

            {/* Social Links Section */}
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="mb-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  {t('followUs')}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto"></div>
              </div>

              <SocialLinks />

              {/* Additional Info */}
              <div className="mt-6">
                <p className="text-sm text-muted">
                  Let's connect and build amazing things together! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
