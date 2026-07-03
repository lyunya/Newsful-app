import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { SavedArticlesProvider } from '../context/SavedArticlesContext';

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <AuthProvider>
          <SavedArticlesProvider>{ui}</SavedArticlesProvider>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

export const sampleArticle = {
  title: 'Something happened today',
  url: 'https://www.npr.org/some-story',
  image: 'https://example.com/image.jpg',
  published: '2026-07-03 04:12:11 +0000',
  lane: 'neutral',
};
