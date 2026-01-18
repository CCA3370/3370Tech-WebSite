export interface LocalizedString {
  zh: string;
  en: string;
}

export interface DownloadLinks {
  xplaneOrg: string; // X-Plane.org store link (placeholder: https://store.x-plane.org/TODO_xxx)
  cdn: string; // CDN download link for China mainland
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
}

export interface ProductsData {
  products: Product[];
}
