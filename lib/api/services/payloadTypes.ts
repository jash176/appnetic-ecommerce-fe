/**
 * Types for the payload-rest-client
 */

// FindResult type from payload-rest-client
export interface FindResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Generic params for find operations
export interface FindParams {
  page?: number;
  limit?: number;
  sort?: string;
  where?: Record<string, any>;
}

// Authentication types
export interface LoginResult {
  token: string;
  user: Record<string, any>;
}

export interface TokenRefreshResult {
  token: string;
  user: Record<string, any>;
} 