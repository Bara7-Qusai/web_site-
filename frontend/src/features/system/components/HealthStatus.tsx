import { useTranslation } from 'react-i18next';

import { Button, ErrorState, LoadingState } from '@/shared/ui';

import { useHealth } from '../api/use-health';

export function HealthStatus() {
  const { t } = useTranslation();
  const health = useHealth();

  if (health.isPending) {
    return <LoadingState label={t('status.checking')} />;
  }
  if (health.isError) {
    return (
      <ErrorState
        title={t('status.error')}
        action={
          <Button
            onClick={() => {
              void health.refetch();
            }}
          >
            {t('status.retry')}
          </Button>
        }
      />
    );
  }
  return (
    <div className="state state--ok" role="status">
      <p>{t('status.ok')}</p>
      <p>{t('status.environment', { environment: health.data.environment })}</p>
    </div>
  );
}
