# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

**MySite** is a bilingual (zh/en) product showcase website built with Next.js 16 (App Router + Turbopack), featuring full-page scrolling and theme customization.

### Core Stack
- Next.js 16.1.3, React 19.2.3, TypeScript 5
- Tailwind CSS 3.4, next-intl 4.7, @fullpage/react-fullpage
- Icons: lucide-react

### Key Architectural Decisions

1. **Locale-based Routing**: All routes prefixed with `[locale]` (e.g., `/zh`, `/en`). Root `/` redirects based on `EO-Client-IPCountry` header (CN → zh, others → en).

2. **Proxy-driven i18n**: `src/proxy.ts` (Next.js 16 renamed middleware) handles locale detection using CDN geo headers and routes via `next-intl/middleware`.

3. **Geo-based Download Logic**: `SmartDownloadButton` calls `/api/geo` which reads `EO-Client-IPCountry` header to show CDN downloads for China users, X-Plane.org for others.

4. **Theme via CSS Variables**: Themes (minimal/tech/soft) use `data-theme` attribute on `<html>` with CSS custom properties (`--primary`, `--accent`, `--background`) in `globals.css`.

5. **Centralized Product Data**: `src/data/products.json` is single source of truth, accessed via `src/lib/products.ts` utilities.

### Localized Strings Pattern
```typescript
interface LocalizedString {
  zh: string;
  en: string;
}
```
Always provide both `zh` and `en` keys. Access via `useTranslations()` hook or `getTranslations()` server-side.

### Product Data Flow
1. Define in `src/data/products.json`
2. Access via `getAllProducts()`, `getProductBySlug()` from `src/lib/products.ts`
3. Static generation uses `generateStaticParams()` in `products/[slug]/page.tsx`

## Adding Content

### New Product
1. Add object to `products.json` (id, slug, name, description, image, download, version, tags, features)
2. Add image to `public/images/products/`
3. Product auto-appears on home and gets detail page at `/[locale]/products/[slug]`

### New Page
1. Create `src/app/[locale]/your-page/page.tsx`
2. Add message keys to both `messages/en.json` and `messages/zh.json`
3. Update navigation in `Header.tsx`

### Translations
Update `messages/en.json` and `messages/zh.json` - components pick up changes via `useTranslations()` hook.

## External Integrations

- **GitHub Releases API**: `src/lib/github.ts` fetches versions for products with `githubRepo` field
- **CDN**: Remote images from `cdn.cloverta.top` configured in `next.config.js`
- **Geo Detection**: `EO-Client-IPCountry` header from Tencent EdgeOne CDN, fallback to `x-vercel-ip-country`
