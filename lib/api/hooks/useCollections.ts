import { useState, useEffect, useCallback } from 'react';
import payloadClient, { createAuthenticatedClient } from '../payloadClient';
import { Collection } from '../services/types';
import { useAuthStore } from '@/store/authStore';

// Simplified Result type for collections
type CollectionResult = {
  docs: Collection[];
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
 * Custom hook for fetching a featured collection by slug
 */
export function useFeaturedCollection(storeId: number = 1, slug: string = 'featured-collection') {
  const [data, setData] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchCollection = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const client = token 
        ? createAuthenticatedClient(token) 
        : payloadClient;
      
      const queryParams = {
        where: {
          store: {
            equals: storeId
          },
          slug: {
            equals: slug
          }
        },
        limit: 1
      };
      
      const result = await client.collections.collections.find(queryParams);
      if (result.docs && result.docs.length > 0) {
        setData(result.docs[0]);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching featured collection:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [storeId, slug, token]);
  
  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);
  
  return { data, isLoading, isError, refetch: fetchCollection };
}

/**
 * Custom hook for fetching collections
 */
export function useCollections(params?: {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}) {
  const [data, setData] = useState<CollectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchCollections = useCallback(async () => {
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
      
      const result = await client.collections.collections.find(queryParams);
      setData(result as any);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [params, token]);
  
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);
  
  return { data, isLoading, isError, refetch: fetchCollections };
}

/**
 * Custom hook for fetching a single collection by ID
 */
export function useCollection(id: number | undefined) {
  const [data, setData] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { token } = useAuthStore();
  
  const fetchCollection = useCallback(async () => {
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
      
      const result = await client.collections.collections.findById({ id });
      setData(result as any);
    } catch (error) {
      console.error('Error fetching collection:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);
  
  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);
  
  return { data, isLoading, isError, refetch: fetchCollection };
} 