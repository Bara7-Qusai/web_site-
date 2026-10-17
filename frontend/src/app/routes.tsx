import type { RouteObject } from 'react-router-dom';

import type { FeatureRoute } from '@/shared/feature';

import { AppLayout } from './AppLayout';
import { NotFoundPage } from './pages/NotFoundPage';
import { RouteErrorPage } from './pages/RouteErrorPage';

function toRoute({ path, Page }: FeatureRoute): RouteObject {
  return path === '/' ? { index: true, Component: Page } : { path, Component: Page };
}

export function createAppRoutes(features: FeatureRoute[]): RouteObject[] {
  return [
    {
      path: '/',
      element: <AppLayout features={features} />,
      errorElement: <RouteErrorPage />,
      children: [...features.map(toRoute), { path: '*', Component: NotFoundPage }],
    },
  ];
}
