import React from 'react';
import { useLoadingStore } from '@/hooks/useLoading';
import LoadingOverlay from './LoadingOverlay';

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const { isLoading, loadingText } = useLoadingStore();
  
  return (
    <>
      {children}
      <LoadingOverlay visible={isLoading} text={loadingText} />
    </>
  );
} 