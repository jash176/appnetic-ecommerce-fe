import { useState, useEffect, useCallback } from 'react';
import payloadClient, { createAuthenticatedClient } from '../payloadClient';
import { Product } from '../services/types';
import { useAuthStore } from '@/store/authStore';

// Params type for product queries
type ProductParams = {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
};

// Simplified Result type that works with both our custom hooks and payload-rest-client
type ProductResult = {
  docs: Product[];
  totalDocs?: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage?: number | null;
  nextPage?: number | null;
};

/**
 * Custom hook for fetching products
 */
export function useProducts(params?: ProductParams) {
  const [data, setData] = useState<ProductResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const client = token 
        ? createAuthenticatedClient(token) 
        : payloadClient;
      
      const queryParams: any = {};
      
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.sort) queryParams.sort = params.sort;
      if (params?.where) queryParams.where = params.where;
      
      const result = await client.collections.products.find(queryParams);
      setData(result as any);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [params, token]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return { data, isLoading, isError, refetch: fetchProducts };
}

/**
 * Custom hook for fetching a single product by ID
 */
export function useProduct(id: number | undefined) {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchProduct = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const client = token 
        ? createAuthenticatedClient(token) 
        : payloadClient;
      
      const result = await client.collections.products.findById({ id });
      setData(result as any);
    } catch (error) {
      console.error('Error fetching product:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);
  
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  
  return { data, isLoading, isError, refetch: fetchProduct };
}

/**
 * Custom hook for fetching products by category
 */
export function useProductsByCategory(categoryId: number | undefined, params?: {
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<ProductResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchProducts = useCallback(async () => {
    if (!categoryId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const client = token 
        ? createAuthenticatedClient(token) 
        : payloadClient;
      
      const queryParams: any = {
        where: {
          categories: {
            contains: categoryId
          }
        }
      };
      
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      
      const result = await client.collections.products.find(queryParams);
      setData(result as any);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, params, token]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return { data, isLoading, isError, refetch: fetchProducts };
}

/**
 * Custom hook for searching products
 */
export function useSearchProducts(query: string | undefined, params?: {
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<ProductResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchProducts = useCallback(async () => {
    if (!query || query.length < 3) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const client = token 
        ? createAuthenticatedClient(token) 
        : payloadClient;
      
      const queryParams: any = {
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
      };
      
      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      
      const result = await client.collections.products.find(queryParams);
      setData(result as any);
    } catch (error) {
      console.error('Error searching products:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [query, params, token]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  return { data, isLoading, isError, refetch: fetchProducts };
} 