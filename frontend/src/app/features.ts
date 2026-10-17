import { systemFeature } from '@/features/system';
import type { FeatureRoute } from '@/shared/feature';

/** Every feature mounted in the shell, in navigation order. Business modules are added here. */
export const features: FeatureRoute[] = [systemFeature];
