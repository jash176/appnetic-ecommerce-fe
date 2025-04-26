import { useState, useCallback } from 'react';
import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  loadingText: string | undefined;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
}

// Global loading state store using Zustand
export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  loadingText: undefined,
  showLoading: (text?: string) => set({ isLoading: true, loadingText: text }),
  hideLoading: () => set({ isLoading: false, loadingText: undefined }),
}));

// Hook for local component loading state
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);

  const showLoading = useCallback((text?: string) => {
    setIsLoading(true);
    setLoadingText(text);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText(undefined);
  }, []);

  // Helper to wrap async functions with loading state
  const withLoading = useCallback(
    async <T,>(
      promise: Promise<T>,
      options?: { text?: string; hideOnSuccess?: boolean; hideOnError?: boolean }
    ): Promise<T> => {
      try {
        showLoading(options?.text);
        const result = await promise;
        if (options?.hideOnSuccess !== false) {
          hideLoading();
        }
        return result;
      } catch (error) {
        if (options?.hideOnError !== false) {
          hideLoading();
        }
        throw error;
      }
    },
    [showLoading, hideLoading]
  );

  return {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    withLoading,
  };
} 