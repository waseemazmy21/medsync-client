"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function QueryProviders({ children }: { children: React.ReactNode }) {
  const queryClient =
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          // retry: 1,
        },
      },
    })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
