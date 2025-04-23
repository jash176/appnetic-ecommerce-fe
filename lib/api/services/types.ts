/**
 * Common PayloadCMS response fields
 */
export interface PayloadBaseFields {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * PayloadCMS pagination info
 */
export interface PaginationInfo {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * PayloadCMS paginated response
 */
export interface PaginatedDocs<T> {
  docs: T[];
  pagination: PaginationInfo;
}

/**
 * Category model
 */
export interface Category extends PayloadBaseFields {
  name: string;
  slug: string;
  description?: string;
  image?: Media;
  parent?: Category;
}

/**
 * Media model
 */
export interface Media extends PayloadBaseFields {
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  alt?: string;
}

/**
 * Product variant
 */
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  options?: Record<string, string>;
}

/**
 * Product model
 */
export interface Product extends PayloadBaseFields {
  title: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: Media[];
  categories?: Category[];
  tags?: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  status: 'draft' | 'published';
  metadata?: {
    [key: string]: any;
  };
} 