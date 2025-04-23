import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, getProductById, getProductsByCategory, searchProducts } from '../services/products';
import { PaginatedDocs, Product } from '../services/types';

/**
 * Fetch products with pagination and optional filtering
 */
export function useProducts(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}) {
  return useQuery<PaginatedDocs<Product>>({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });
}

/**
 * Fetch a single product by ID
 */
export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProductById(id as string),
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Fetch products by category
 */
export function useProductsByCategory(categoryId: string | undefined, params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedDocs<Product>>({
    queryKey: ['products', 'category', categoryId, params],
    queryFn: () => getProductsByCategory(categoryId as string, params),
    enabled: !!categoryId, // Only run if categoryId is provided
  });
}

/**
 * Search products by query string
 */
export function useSearchProducts(query: string | undefined, params?: {
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedDocs<Product>>({
    queryKey: ['products', 'search', query, params],
    queryFn: () => searchProducts(query as string, params),
    enabled: !!query && query.length > 2, // Only run if query is at least 3 characters
  });
} 