import type { ParseKeys } from 'i18next';
import type { ComponentType } from 'react';

/** What a feature module tells the app shell: where it lives and how it appears in navigation. */
export interface FeatureRoute {
  id: string;
  /** '/' marks the index route; otherwise a path relative to the root, without a leading slash. */
  path: string;
  labelKey: ParseKeys;
  Page: ComponentType;
}
