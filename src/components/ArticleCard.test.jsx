import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import ArticleCard from './ArticleCard';
import { renderWithProviders, sampleArticle } from '../test/test-utils';

describe('ArticleCard', () => {
  it('renders the headline as an external link', () => {
    renderWithProviders(<ArticleCard article={sampleArticle} />);
    const headline = screen.getByRole('link', {
      name: sampleArticle.title,
    });
    expect(headline).toHaveAttribute('href', sampleArticle.url);
    expect(headline).toHaveAttribute('target', '_blank');
  });

  it('shows the source domain', () => {
    renderWithProviders(<ArticleCard article={sampleArticle} />);
    expect(screen.getByText(/npr\.org/)).toBeInTheDocument();
  });

  it('bookmarks and un-bookmarks as a guest without any network', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ArticleCard article={sampleArticle} />);

    await user.click(screen.getByRole('button', { name: /bookmark article/i }));
    expect(
      screen.getByRole('button', { name: /remove bookmark/i })
    ).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: /remove bookmark/i }));
    expect(
      screen.getByRole('button', { name: /bookmark article/i })
    ).toHaveAttribute('aria-pressed', 'false');
  });
});
