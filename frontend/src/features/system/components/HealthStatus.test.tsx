import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ApiTestProviders, healthyBackend } from '@/test/fake-api';

import { HealthStatus } from './HealthStatus';

describe('HealthStatus', () => {
  it('shows a loading state, then the backend environment when healthy', async () => {
    render(
      <ApiTestProviders handler={healthyBackend}>
        <HealthStatus />
      </ApiTestProviders>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Checking the backend…');
    expect(await screen.findByText('The backend is reachable.')).toBeInTheDocument();
    expect(screen.getByText('Environment: test')).toBeInTheDocument();
  });

  it('shows an error and recovers when retried', async () => {
    let healthy = false;
    render(
      <ApiTestProviders
        handler={() => (healthy ? healthyBackend(new Request('http://api.test/health')) : new Response(null, { status: 503 }))}
      >
        <HealthStatus />
      </ApiTestProviders>,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the backend.');

    healthy = true;
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('The backend is reachable.')).toBeInTheDocument();
  });

  it('treats a network failure as an error', async () => {
    render(
      <ApiTestProviders
        handler={() => {
          throw new TypeError('Failed to fetch');
        }}
      >
        <HealthStatus />
      </ApiTestProviders>,
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not reach the backend.');
  });
});
