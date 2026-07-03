import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ news: [] }) })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the news feed at / with no login wall', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(
      await screen.findByRole('heading', { name: 'Newsful' })
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('redirects the legacy /home route to /', async () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(
      await screen.findByRole('heading', { name: 'Newsful' })
    ).toBeInTheDocument();
  });
});
