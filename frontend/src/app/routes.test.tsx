import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ApiTestProviders, healthyBackend } from '@/test/fake-api';

import { features } from './features';
import { createAppRoutes } from './routes';

function renderAt(path: string) {
  const router = createMemoryRouter(createAppRoutes(features), { initialEntries: [path] });
  render(
    <ApiTestProviders handler={healthyBackend}>
      <RouterProvider router={router} />
    </ApiTestProviders>,
  );
}

describe('application routes', () => {
  it('renders the shell with navigation and the start page', async () => {
    renderAt('/');
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'System status' })).toHaveAttribute('aria-current', 'page');
    expect(await screen.findByText('The backend is reachable.')).toBeInTheDocument();
  });

  it('shows a not-found page inside the shell for unknown paths and links home', async () => {
    renderAt('/no/such/page');
    expect(await screen.findByRole('alert')).toHaveTextContent('Page not found');
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('link', { name: 'Back to the start page' }));
    expect(await screen.findByText('The backend is reachable.')).toBeInTheDocument();
  });
});
