import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'zh'
});

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
