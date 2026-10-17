import { useTranslation } from 'react-i18next';

import { HealthStatus } from '../components/HealthStatus';

export default function SystemStatusPage() {
  const { t } = useTranslation();
  return (
    <section>
      <h1>{t('status.heading')}</h1>
      <HealthStatus />
    </section>
  );
}
