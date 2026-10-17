export const en = {
  app: { title: 'Pharmacy Management System' },
  common: { loading: 'Loading…' },
  nav: { label: 'Main navigation', skipToContent: 'Skip to content', systemStatus: 'System status' },
  language: { label: 'Language', en: 'English', ar: 'العربية' },
  status: {
    heading: 'Backend status',
    checking: 'Checking the backend…',
    ok: 'The backend is reachable.',
    environment: 'Environment: {{environment}}',
    error: 'Could not reach the backend.',
    retry: 'Try again',
  },
  notFound: {
    title: 'Page not found',
    body: 'The page you requested does not exist.',
    back: 'Back to the start page',
  },
  error: {
    title: 'Something went wrong',
    body: 'An unexpected error occurred. You can reload the page.',
    reload: 'Reload',
  },
};

export type Translation = typeof en;
