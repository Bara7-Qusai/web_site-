import { useTranslation } from 'react-i18next';

import { Spinner } from './Spinner';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <div className="state" role="status">
      <Spinner />
      <span>{label ?? t('common.loading')}</span>
    </div>
  );
}
