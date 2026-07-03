import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import NewsfulApi from '../services/newsful-api';
import { GuestSaves } from '../services/storage';

const SavedArticlesContext = createContext(null);

// Bookmarks work with or without an account. Guests keep theirs in
// localStorage; signing in pushes any guest bookmarks to the server and
// switches to server-backed saves.
export function SavedArticlesProvider({ children }) {
  const { token, user } = useAuth();
  const [savedArticles, setSavedArticles] = useState(() =>
    token ? [] : GuestSaves.get()
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setSavedArticles(GuestSaves.get());
      return undefined;
    }

    let cancelled = false;
    (async () => {
      try {
        const guestSaves = GuestSaves.get();
        if (guestSaves.length > 0) {
          await Promise.allSettled(
            guestSaves.map(({ title, url, image }) =>
              NewsfulApi.saveArticle(token, { title, url, image })
            )
          );
          GuestSaves.clear();
        }
        const articles = await NewsfulApi.getSavedArticles(token);
        if (!cancelled) {
          // Older API deployments return every user's saves; keep only ours.
          setSavedArticles(
            articles.filter(
              (article) => article.user_id == null || article.user_id === user?.id
            )
          );
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user?.id]);

  const isSaved = useCallback(
    (url) => savedArticles.some((article) => article.url === url),
    [savedArticles]
  );

  const saveArticle = useCallback(
    async (article) => {
      const record = {
        title: article.title,
        url: article.url,
        image: article.image ?? null,
      };
      if (token) {
        const saved = await NewsfulApi.saveArticle(token, record);
        setSavedArticles((current) =>
          current.some((a) => a.url === saved.url)
            ? current
            : [...current, saved]
        );
      } else {
        setSavedArticles((current) => {
          if (current.some((a) => a.url === record.url)) return current;
          const next = [...current, record];
          GuestSaves.set(next);
          return next;
        });
      }
    },
    [token]
  );

  const removeArticle = useCallback(
    async (article) => {
      if (token) {
        const saved = savedArticles.find((a) => a.url === article.url);
        if (saved?.id != null) {
          await NewsfulApi.deleteSavedArticle(token, saved.id);
        }
      }
      setSavedArticles((current) => {
        const next = current.filter((a) => a.url !== article.url);
        if (!token) GuestSaves.set(next);
        return next;
      });
    },
    [token, savedArticles]
  );

  const toggleSave = useCallback(
    (article) =>
      isSaved(article.url) ? removeArticle(article) : saveArticle(article),
    [isSaved, removeArticle, saveArticle]
  );

  return (
    <SavedArticlesContext.Provider
      value={{ savedArticles, isSaved, toggleSave, removeArticle, error }}
    >
      {children}
    </SavedArticlesContext.Provider>
  );
}

export function useSavedArticles() {
  const context = useContext(SavedArticlesContext);
  if (!context) {
    throw new Error('useSavedArticles must be used within SavedArticlesProvider');
  }
  return context;
}
