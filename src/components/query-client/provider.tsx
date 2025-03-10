'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import type * as React from 'react';
import { getQueryClient } from './getQueryClient';

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
