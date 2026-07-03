// Small localStorage helpers. Every read tolerates malformed/missing data.
import config from '../config';

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const TokenStorage = {
  get: () => window.localStorage.getItem(config.TOKEN_KEY),
  set: (token) => window.localStorage.setItem(config.TOKEN_KEY, token),
  clear: () => window.localStorage.removeItem(config.TOKEN_KEY),
};

export const UserStorage = {
  get: () => readJson(config.USER_KEY, null),
  set: (user) => window.localStorage.setItem(config.USER_KEY, JSON.stringify(user)),
  clear: () => window.localStorage.removeItem(config.USER_KEY),
};

// Bookmarks for people without an account, keyed by article URL.
export const GuestSaves = {
  get: () => readJson(config.GUEST_SAVES_KEY, []),
  set: (articles) =>
    window.localStorage.setItem(config.GUEST_SAVES_KEY, JSON.stringify(articles)),
  clear: () => window.localStorage.removeItem(config.GUEST_SAVES_KEY),
};

export const ThemeStorage = {
  get: () => window.localStorage.getItem(config.THEME_KEY),
  set: (theme) => window.localStorage.setItem(config.THEME_KEY, theme),
};
