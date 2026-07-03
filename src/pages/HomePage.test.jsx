import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import HomePage from './HomePage';
import { renderWithProviders } from '../test/test-utils';

const fakeNewsResponse = (domain) => ({
  ok: true,
  json: () =>
    Promise.resolve({
      news: [
        {
          title: `Top story from ${domain}`,
          url: `https://${domain}/story`,
          image: null,
          published: '2026-07-03 04:12:11 +0000',
        },
      ],
    }),
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        const domain = new URL(url).searchParams.get('domain').split(',')[0];
        return Promise.resolve(fakeNewsResponse(domain));
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads all three lanes without requiring a login', async () => {
    renderWithProviders(<HomePage />);

    expect(
      await screen.findByRole('heading', { name: 'Liberal' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Conservative' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Neutral' })
    ).toBeInTheDocument();
    expect(screen.getByText('Top story from msnbc.com')).toBeInTheDocument();
    expect(screen.getByText('Top story from foxnews.com')).toBeInTheDocument();
    expect(screen.getByText('Top story from bbc.com')).toBeInTheDocument();
  });

  it('shows an error state with retry when the news API is down', async () => {
    fetch.mockImplementation(() => Promise.reject(new Error('network down')));
    renderWithProviders(<HomePage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /couldn.t load the news/i
    );
    expect(
      screen.getByRole('button', { name: /retry/i })
    ).toBeInTheDocument();
  });
});
