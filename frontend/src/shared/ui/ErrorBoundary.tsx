import { Component, type ErrorInfo, type ReactNode } from 'react';
import { withTranslation, type WithTranslation } from 'react-i18next';

import { Button } from './Button';
import { ErrorState } from './ErrorState';

interface Props extends WithTranslation {
  children: ReactNode;
}

class ErrorBoundaryBase extends Component<Props, { failed: boolean }> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack);
  }

  override render() {
    const { t, children } = this.props;
    if (!this.state.failed) {
      return children;
    }
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
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryBase);
