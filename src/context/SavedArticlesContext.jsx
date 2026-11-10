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
  const { token, logout } = useAuth();
  const [savedArticles, setSavedArticles] = useState(() =>
    token ? [] : GuestSaves.get()
  );
  const [isLoading, setIsLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  // An expired or revoked token can't be recovered; drop back to guest mode
  // so the person is asked to log in again instead of seeing errors forever.
  const handleAuthFailure = useCallback(
    (err) => {
      if (err?.status === 401) logout();
    },
    [logout]
  );

  useEffect(() => {
    if (!token) {
      setSavedArticles(GuestSaves.get());
      setIsLoading(false);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const guestSaves = GuestSaves.get();
        if (guestSaves.length > 0) {
          const results = await Promise.allSettled(
            guestSaves.map(({ title, url, image, source }) =>
              NewsfulApi.saveArticle(token, { title, url, image, source })
            )
          );
          const rejected = results.find((r) => r.status === 'rejected');
          if (rejected?.reason?.status === 401) throw rejected.reason;
          // Keep whatever didn't upload so it's retried next time.
          const failed = guestSaves.filter(
            (_, i) => results[i].status === 'rejected'
          );
          if (failed.length > 0) GuestSaves.set(failed);
          else GuestSaves.clear();
        }
        const articles = await NewsfulApi.getSavedArticles(token);
        if (!cancelled) {
          setSavedArticles(articles);
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        if (err.status === 401) handleAuthFailure(err);
        else setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, handleAuthFailure]);

  const isSaved = useCallback(
    (url) => savedArticles.some((article) => article.url === url),
    [savedArticles]
  );

  // Both actions update the UI immediately and undo it if the server refuses.
  const saveArticle = useCallback(
    async (article) => {
      const record = {
        title: article.title,
        url: article.url,
        image: article.image ?? null,
        source: article.source ?? null,
      };
      if (!token) {
        setSavedArticles((current) => {
          if (current.some((a) => a.url === record.url)) return current;
          const next = [...current, record];
          GuestSaves.set(next);
          return next;
        });
        return;
      }

      setSavedArticles((current) =>
        current.some((a) => a.url === record.url) ? current : [record, ...current]
      );
      try {
        const saved = await NewsfulApi.saveArticle(token, record);
        setSavedArticles((current) =>
          current.map((a) => (a.url === saved.url ? saved : a))
        );
      } catch (err) {
        setSavedArticles((current) =>
          current.filter((a) => a.url !== record.url || a.id != null)
        );
        handleAuthFailure(err);
        throw err;
      }
    },
    [token, handleAuthFailure]
  );

  const removeArticle = useCallback(
    async (article) => {
      const saved = savedArticles.find((a) => a.url === article.url);
      setSavedArticles((current) => {
        const next = current.filter((a) => a.url !== article.url);
        if (!token) GuestSaves.set(next);
        return next;
      });
      if (!token || saved?.id == null) return;

      try {
        await NewsfulApi.deleteSavedArticle(token, saved.id);
      } catch (err) {
        // Already gone on the server counts as removed.
        if (err.status === 404) return;
        setSavedArticles((current) =>
          current.some((a) => a.url === saved.url) ? current : [saved, ...current]
        );
        handleAuthFailure(err);
        throw err;
      }
    },
    [token, savedArticles, handleAuthFailure]
  );

  const toggleSave = useCallback(
    (article) =>
      isSaved(article.url) ? removeArticle(article) : saveArticle(article),
    [isSaved, removeArticle, saveArticle]
  );

  return (
    <SavedArticlesContext.Provider
      value={{
        savedArticles,
        isSaved,
        toggleSave,
        removeArticle,
        isLoading,
        error,
      }}
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
