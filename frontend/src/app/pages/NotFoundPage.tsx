import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ErrorState } from '@/shared/ui';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <ErrorState
      title={t('notFound.title')}
      message={t('notFound.body')}
      action={<Link to="/">{t('notFound.back')}</Link>}
    />
  );
}
