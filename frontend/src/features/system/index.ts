import { lazy } from 'react';

import type { FeatureRoute } from '@/shared/feature';

/** Public interface of the system feature: the only thing the app shell imports. */
export const systemFeature: FeatureRoute = {
  id: 'system',
  path: '/',
  labelKey: 'nav.systemStatus',
  Page: lazy(() => import('./pages/SystemStatusPage')),
};
