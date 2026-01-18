# Copilot Instructions for MySite Codebase

## Architecture Overview

**MySite** is a multi-language product showcase website built with Next.js 16, featuring full-page scrolling, theme customization, and bilingual (zh/en) support. It showcases software products with download options from GitHub, local server, and CDN.

### Core Stack
- **Framework**: Next.js 16.1.3 (App Router + Turbopack)
- **Language**: TypeScript 5
- **UI**: React 19.2.3 + Tailwind CSS 3.4
- **Internationalization**: `next-intl` (middleware + routing)
- **Scroll Effects**: `@fullpage/react-fullpage`
- **Icons**: `lucide-react`

### Key Architectural Decisions

1. **Locale-based Routing**: All user-facing routes are prefixed with `[locale]` (e.g., `/zh`, `/en`). The root `/` redirects to `/zh` via `src/app/page.tsx`.
2. **Middleware-driven i18n**: `src/middleware.ts` uses `next-intl/middleware` to automatically handle locale detection and routing.
3. **Client vs Server Components**: Pages use `'use client'` for interactivity (homepage with scroll tracking). Product detail pages are SSR-rendered with `generateStaticParams()` for static generation.
4. **Theme via CSS Variables**: Themes (minimal/tech/soft) apply `data-theme` attribute to `<html>` and use CSS custom properties (`--primary`, `--accent`, `--background`) rather than Tailwind classes.
5. **Centralized Product Data**: `src/data/products.json` is the single source of truth; accessed via `src/lib/products.ts` utility functions.

## Directory Structure & Key Files

```
src/
├── app/
│   ├── layout.tsx              # Root layout (minimal, just returns children)
│   ├── page.tsx                # Redirects / to /zh
│   ├── [locale]/
│   │   ├── layout.tsx          # Locale layout with Header, Footer, theme wrapper
│   │   ├── page.tsx            # Home page: fullpage scroll with all products
│   │   ├── products/[slug]/page.tsx  # Individual product detail pages (SSG)
│   │   └── about/page.tsx       # About page
│   └── api/github-version/route.ts  # API: fetch latest GitHub release versions
├── components/
│   ├── Header.tsx              # Navigation header (all locales/themes)
│   ├── ProductSection.tsx       # Single product display (home page)
│   ├── DownloadButton.tsx       # Download link button (color varies by type)
│   ├── VersionDisplay.tsx       # Displays version + fetches live from GitHub
│   ├── ThemeSwitcher.tsx        # Theme selector modal
│   ├── LanguageSwitcher.tsx     # Language toggle
│   ├── Footer.tsx              # Footer with social links
│   ├── SocialLinks.tsx          # Reusable social icons
│   └── FullPageWrapper.tsx      # Wrapper for @fullpage/react-fullpage
├── data/
│   └── products.json           # Product definitions (localized strings)
├── i18n/
│   ├── routing.ts              # `next-intl` routing config (locales array, navigation utils)
│   └── request.ts              # Server-side i18n request handler
├── lib/
│   ├── products.ts             # Utility: getAllProducts(), getProductBySlug(), etc.
│   └── github.ts               # API: fetchGitHubReleases() for version fetching
├── types/
│   └── product.ts              # TypeScript interfaces: Product, LocalizedString, DownloadLink
├── middleware.ts               # `next-intl` middleware for locale routing
└── globals.css                 # Global styles (CSS variables for themes)

messages/
├── en.json                      # English translations (nav, home, product, about, theme)
└── zh.json                      # Chinese translations (all keys mirrored from en.json)
```

## Critical Patterns & Conventions

### 1. Localized Strings
All user-facing content uses the `LocalizedString` interface:
```typescript
interface LocalizedString {
  zh: string;
  en: string;
}
```
**When adding text**: Always provide both `zh` and `en` keys in `products.json` or message files. Access via:
- Client: `useTranslations('namespace')` + `locale = useLocale() as 'zh' | 'en'`
- Server: `getTranslations('namespace')` (from `next-intl/server`)

### 2. Theme System
Themes apply CSS variables to `<html data-theme="minimal|tech|soft">`. Components use `style={{ color: 'var(--primary)', backgroundColor: 'var(--card-bg)' }}` instead of Tailwind color classes. Theme state is managed in `ThemeSwitcher.tsx` and persisted to `localStorage`.

**CSS Variable Pattern**: See `src/globals.css` for variable definitions per theme.

### 3. Product Data Flow
1. **Definition**: `src/data/products.json` (single source of truth)
2. **Access**: `src/lib/products.ts` exports `getAllProducts()`, `getProductBySlug()`, `getProductSlugs()`
3. **Consumption**:
   - Home page: Maps products to `<ProductSection>` components
   - Detail page: Uses `getProductBySlug(slug)` from params
   - Static generation: `generateStaticParams()` in `products/[slug]/page.tsx`

### 4. Download Links
Each product has `downloads: DownloadLink[]` with `type: 'github' | 'local' | 'cdn'`. The `DownloadButton` component colorizes based on type (GitHub=dark, local=accent, CDN=primary).

### 5. Fullpage Scrolling
Home page wraps products in `<FullPageWrapper>` from `@fullpage/react-fullpage`. Each product is a `.section` div. Scroll progress is tracked in state for animations.

## Development Workflow

### Build & Run
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding a New Product
1. Add object to `products.json` (follow existing schema: id, slug, name, description, image, downloads, version, tags, features)
2. Add product image to `public/images/products/`
3. No code changes needed; product auto-appears on home and gets detail page at `/[locale]/products/[slug]`

### Adding a New Page (e.g., Blog)
1. Create `src/app/[locale]/blog/page.tsx` (if locale-specific)
2. Import `useTranslations` and `useLocale` for i18n
3. Add message keys to both `messages/en.json` and `messages/zh.json`
4. Update navigation in `Header.tsx`

### Modifying Translations
1. Update `messages/en.json` or `messages/zh.json`
2. Components automatically pick up changes via `useTranslations()` hook
3. Test both locales locally via URL (`/en/...`, `/zh/...`)

## Integration Points & External Dependencies

- **GitHub Releases API**: `src/lib/github.ts` fetches latest version for products with `githubRepo` field. Called by `VersionDisplay.tsx` on product detail pages.
- **CDN Image Hosting**: `public/images/` (local) and `http://cdn.cloverta.top/` (remote). Both configured in `next.config.js` via `remotePatterns`.
- **Local Downloads**: Files stored in `public/downloads/`. Direct file serving via Next.js.

## Common Tasks for AI Agents

### Task: Add a new feature to product cards
- Modify `src/components/ProductSection.tsx` (rendering logic)
- Update `src/types/product.ts` if adding new fields to `Product` interface
- Ensure both locales display correctly with `useLocale()` type casting

### Task: Fix a translation key
- Search in `messages/*.json` for the key
- Update both `en.json` and `zh.json` to keep them in sync
- Test via `useTranslations('namespace').key` in components

### Task: Change theme colors
- Edit `src/globals.css` (CSS variables for minimal/tech/soft themes)
- Components using `style={{ color: 'var(--primary)' }}` update automatically
- Verify all three themes render correctly by switching in `ThemeSwitcher`

### Task: Add GitHub version fetching to a product
- Add `githubRepo: { owner: '...', repo: '...' }` to product in `products.json`
- `VersionDisplay.tsx` automatically calls `fetchGitHubReleases()` from `src/lib/github.ts`
- No code changes needed beyond the data config

## Testing & Validation

- **i18n**: Navigate to `/zh/...` and `/en/...` URLs to verify translations
- **Themes**: Use ThemeSwitcher component to toggle between minimal/tech/soft
- **Static Generation**: Check build logs for product page slug generation
- **Images**: Ensure remote CDN images render (logged to network panel) and local images exist in `public/images/`
