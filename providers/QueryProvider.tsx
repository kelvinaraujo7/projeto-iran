"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {

            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
            retry: (failureCount, error: any) => {

              if (error?.status === 404 || error?.status === 401) {
                return false;
              }
              return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
