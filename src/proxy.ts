import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already has a locale prefix
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If no locale in path, determine the default based on country
  if (!pathnameHasLocale && pathname === '/') {
    // Get country from CDN header (EO-Client-IPCountry from Tencent EdgeOne)
    // Falls back to Vercel's header for local development
    const country = request.headers.get('EO-Client-IPCountry')
      || request.headers.get('x-vercel-ip-country');

    // China mainland (CN) gets Chinese, all others get English
    const locale = country === 'CN' ? 'zh' : 'en';

    // Redirect to the appropriate locale
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  // Use next-intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(zh|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
