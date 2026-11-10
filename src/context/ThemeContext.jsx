import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeStorage } from '../services/storage';

const ThemeContext = createContext(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

function storedTheme() {
  const stored = ThemeStorage.get();
  return stored === 'light' || stored === 'dark' ? stored : null;
}

function systemTheme() {
  if (typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

// The theme follows the system setting until the user picks one with the
// toggle; only an explicit choice is saved. index.html applies the same
// rule before first paint so there's no flash of the wrong theme.
export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(storedTheme);
  const [system, setSystem] = useState(systemTheme);
  const theme = choice ?? system;

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia(DARK_QUERY);
    const onChange = (event) => setSystem(event.matches ? 'dark' : 'light');
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    ThemeStorage.set(next);
    setChoice(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
