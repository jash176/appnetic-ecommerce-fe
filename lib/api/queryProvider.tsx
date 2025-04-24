import React from 'react';

interface ApiProviderProps {
  children: React.ReactNode;
}

/**
 * ApiProvider is a simple container for API context
 * Now we use direct Payload client calls instead of React Query
 */
export function ApiProvider({ children }: ApiProviderProps) {
  return <>{children}</>;
} 