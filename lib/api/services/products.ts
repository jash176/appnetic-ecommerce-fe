import apiClient from '../client';
import { Product } from './types';

/**
 * Fetch products from PayloadCMS with filtering, pagination, and sorting
 */
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}) {
  const response = await apiClient.get('/products', { params });
  return response.data;
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string) {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(categoryId: string, params?: {
  page?: number;
  limit?: number;
}) {
  const response = await apiClient.get('/products', {
    params: {
      ...params,
      where: {
        categories: {
          contains: categoryId
        }
      }
    }
  });
  return response.data;
}

/**
 * Search products
 */
export async function searchProducts(query: string, params?: {
  page?: number;
  limit?: number;
}) {
  const response = await apiClient.get('/products', {
    params: {
      ...params,
      where: {
        or: [
          {
            title: {
              like: query
            }
          },
          {
            description: {
              like: query
            }
          }
        ]
      }
    }
  });
  return response.data;
} 