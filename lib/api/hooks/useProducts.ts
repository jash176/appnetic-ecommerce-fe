import { useState, useEffect, useCallback } from 'react';
import payloadClient, { createAuthenticatedClient } from '../payloadClient';
import { Category, Product, ProductsSelect } from '../services/types';
import { useAuthStore } from '@/store/authStore';
import { Config, FindParams, FindResult } from 'payload-rest-client/dist/types';
import { useLoadingStore } from '@/hooks/useLoading';
import { getStoreId } from '@/service/storeService';

// Params type for product queries
type ProductParams = {
  page?: number;
  limit?: number;
  sort?: any;
  where?: Record<string, any>;
};

/**
 * Custom hook for fetching products
 */
export function useProducts(params?: ProductParams) {
  console.log("Params : ", JSON.stringify(params))
  const { showLoading, hideLoading } = useLoadingStore();
  const [data, setData] = useState<FindResult<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      showLoading("Loading products...")
      const client = token
        ? createAuthenticatedClient(token)
        : payloadClient;

      const queryParams: FindParams<Config, any, Product, unknown, ProductsSelect<false> | ProductsSelect<true>> | undefined = {};

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;
      if(params?.sort) queryParams.sort = params.sort;
      if (params?.where) queryParams.where = params.where;

      const result = await client.collections.products.find(queryParams);
      if(result) {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      hideLoading();
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
  const { showLoading, hideLoading } = useLoadingStore();
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    showLoading("Loading details...")
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
      hideLoading();
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
  const [data, setData] = useState<Product[]>([]);
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
          },
          store: {
            equals: getStoreId()
          }
        }
      };

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      const result = await client.collections.products.find(queryParams);
      setData(result.docs as any);
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
 * Custom hook for fetching products by category
 */
export function useProductsByCollection(collectionId: number | undefined, params?: {
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();

  const fetchProducts = useCallback(async () => {
    if (!collectionId) {
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
          id: {
            equals: collectionId
          },
          store: {
            equals: getStoreId()
          }
        }
      };

      if (params?.page) queryParams.page = params.page;
      if (params?.limit) queryParams.limit = params.limit;

      const result = await client.collections.collections.find(queryParams);
      setData(result.docs as any);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, params, token]);

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
  const [data, setData] = useState<ProductsSelect | null>(null);
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

/**
 * Custom hook for fetching categories
 */

export const useCategories = () => {
  const { showLoading, hideLoading } = useLoadingStore();
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  const [totalDocs, setTotalDocs] = useState(0);
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      showLoading("Loading categories...")
      const client = token
        ? createAuthenticatedClient(token)
        : payloadClient;

      const result = await client.collections.categories.find({
        where: {
          store: {
            equals: getStoreId()
          }
        },
        limit: 5
      });
      setTotalDocs(result.totalDocs);
      setData(result.docs);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, isLoading, isError, refetch: fetchCategories, totalDocs };
}

export const useCateogryProductsCount = (id: string) => {
  const [count, setCount] = useState(0)
  const { token } = useAuthStore();
  
  const fetchCount = async () => {
    const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
    const count = await client.collections.products.find({
      depth: 0,
      limit: 0,
      where: {
        categories: {
          contains: id
        },
        store: {
          equals: getStoreId(),
        }
      }
    })
    setCount(count.totalDocs)
  }
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);
  return {count}
}

export const useCollectionProductsCount = (id: number) => {
  const [count, setCount] = useState(0)
  const { token } = useAuthStore();
  
  const fetchCount = async () => {
    const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
    const count = await client.collections.collections.find({
      depth: 0,
      limit: 0,
      where: {
        id: {
          equals: id
        },
        store: {
          equals: getStoreId(),
        }
      }
    })
    setCount(count.totalDocs)
  }
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);
  return {count}
}