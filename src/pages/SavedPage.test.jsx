import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import SavedPage from './SavedPage';
import { renderWithProviders, sampleArticle } from '../test/test-utils';
import config from '../config';

describe('SavedPage', () => {
  it('shows an empty state for new visitors', () => {
    renderWithProviders(<SavedPage />);
    expect(screen.getByText(/nothing saved yet/i)).toBeInTheDocument();
  });

  it('shows guest bookmarks from localStorage', () => {
    window.localStorage.setItem(
      config.GUEST_SAVES_KEY,
      JSON.stringify([sampleArticle])
    );
    renderWithProviders(<SavedPage />);
    expect(screen.getByText(sampleArticle.title)).toBeInTheDocument();
    expect(
      screen.getByText(/bookmarks are stored on this device/i)
    ).toBeInTheDocument();
  });
});
