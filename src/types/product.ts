export interface LocalizedString {
  zh: string;
  en: string;
}

export interface PlatformDownloads {
  win?: {
    portable: string;
    installer: string;
  };
  mac?: string;
  linux?: {
    appimage: string;
    rpm: string;
    deb: string;
  };
}

export interface DownloadLinks {
  xplaneOrg: string; // X-Plane.org store link
  cdn: string; // CDN download link for China mainland (fallback)
  cdnPlatform?: PlatformDownloads; // Platform-specific CDN downloads
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  longDescription: LocalizedString;
  image: string;
  download: DownloadLinks;
  version: string;
  githubRepo?: string; // Format: "owner/repo" for version fetching
  tags: string[];
  features?: LocalizedString[];
  available?: boolean; // Whether the product is available for download
}

export interface ProductsData {
  products: Product[];
}
