import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { createApiClient } from '@/shared/api/client';
import { ApiClientProvider } from '@/shared/api/api-client-context';
import { env } from '@/shared/config/env';

import { features } from './features';
import { createQueryClient } from './query-client';
import { createAppRoutes } from './routes';

export function App() {
  // Created once per mount; none of these depend on props.
  const [queryClient] = useState(createQueryClient);
  const [apiClient] = useState(() => createApiClient({ baseUrl: env.apiBaseUrl }));
  const [router] = useState(() => createBrowserRouter(createAppRoutes(features)));

  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={apiClient}>
        <RouterProvider router={router} />
      </ApiClientProvider>
    </QueryClientProvider>
  );
}
