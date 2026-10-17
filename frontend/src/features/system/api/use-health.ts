import { useQuery } from '@tanstack/react-query';

import { useApiClient } from '@/shared/api/api-client-context';

export function useHealth() {
  const client = useApiClient();
  return useQuery({
    queryKey: ['system', 'health'],
    queryFn: async () => {
      const { data, response } = await client.GET('/health');
      if (data === undefined) {
        throw new Error(`Health check failed with HTTP ${String(response.status)}`);
      }
      return data;
    },
    retry: false,
  });
}
