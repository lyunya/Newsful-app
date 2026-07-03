import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { renderWithProviders } from '../test/test-utils';

describe('Header', () => {
  it('shows navigation and a login link for guests', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /saved/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
  });

  it('toggles the theme', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const initialTheme = document.documentElement.dataset.theme;
    await user.click(
      screen.getByRole('button', { name: /switch to (light|dark) mode/i })
    );
    expect(document.documentElement.dataset.theme).not.toBe(initialTheme);
  });
});
