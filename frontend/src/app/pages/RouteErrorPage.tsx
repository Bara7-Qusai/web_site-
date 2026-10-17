import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';

import { Button, ErrorState } from '@/shared/ui';

/** Shown by the router when a route throws while rendering or loading. */
export function RouteErrorPage() {
  const { t } = useTranslation();
  console.error('Route error', useRouteError());
  return (
    <ErrorState
      title={t('error.title')}
      message={t('error.body')}
      action={
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          {t('error.reload')}
        </Button>
      }
    />
  );
}
