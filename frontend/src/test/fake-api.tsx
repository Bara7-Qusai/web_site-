import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { ApiClientProvider } from '@/shared/api/api-client-context';
import { createApiClient } from '@/shared/api/client';

type Handler = (request: Request) => Response | Promise<Response>;

/** Test wrapper: a real typed client whose network layer is replaced by `handler`. */
export function ApiTestProviders({ handler, children }: { handler: Handler; children: ReactNode }) {
  const client = createApiClient({
    baseUrl: 'http://api.test',
    fetch: (request) => Promise.resolve(handler(request)),
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={client}>{children}</ApiClientProvider>
    </QueryClientProvider>
  );
}

export const healthyBackend: Handler = () =>
  Response.json({ status: 'ok', environment: 'test' });
