import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';

import type { FeatureRoute } from '@/shared/feature';
import { LanguageSwitcher } from '@/shared/i18n';
import { ErrorBoundary, LoadingState } from '@/shared/ui';

export function AppLayout({ features }: { features: FeatureRoute[] }) {
  const { t } = useTranslation();
  return (
    <div className="layout">
      <a className="skip-link" href="#content">
        {t('nav.skipToContent')}
      </a>
      <header className="layout__header">
        <strong>{t('app.title')}</strong>
        <LanguageSwitcher />
      </header>
      <nav className="layout__nav" aria-label={t('nav.label')}>
        {features.map((feature) => (
          <NavLink key={feature.id} to={feature.path} end>
            {t(feature.labelKey)}
          </NavLink>
        ))}
      </nav>
      <main id="content" className="layout__main">
        <ErrorBoundary>
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
