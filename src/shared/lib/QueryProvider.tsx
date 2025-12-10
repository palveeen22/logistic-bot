'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function TanstackProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Konfigurasi default untuk semua queries
            staleTime: 60 * 1000, // 1 menit
            refetchOnWindowFocus: false, // Tidak auto-refetch saat fokus window
            retry: 1, // Retry 1x jika gagal
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}