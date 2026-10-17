import createClient, { type ClientOptions } from 'openapi-fetch';

import type { paths } from './schema';

export type ApiClient = ReturnType<typeof createApiClient>;

/** Typed client; request and response types come from contracts/openapi.json via `npm run api:generate`. */
export function createApiClient(options: Pick<ClientOptions, 'baseUrl' | 'fetch'>) {
  return createClient<paths>(options);
}
