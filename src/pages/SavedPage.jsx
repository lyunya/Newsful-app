import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ArticleCard from '../components/ArticleCard';
import { useAuth } from '../context/AuthContext';
import { useSavedArticles } from '../context/SavedArticlesContext';
import './SavedPage.css';

export default function SavedPage() {
  const { user } = useAuth();
  const { savedArticles, error } = useSavedArticles();

  return (
    <>
      <Header />
      <main className="saved-page">
        <h1 className="saved-title">Saved articles</h1>

        {!user && savedArticles.length > 0 && (
          <p className="saved-hint">
            Bookmarks are stored on this device.{' '}
            <Link to="/login">Log in</Link> to keep them everywhere.
          </p>
        )}

        {error && (
          <p className="saved-error" role="alert">
            {error}
          </p>
        )}

        {savedArticles.length > 0 ? (
          <div className="saved-grid">
            {savedArticles.map((article) => (
              <ArticleCard article={article} key={article.url} />
            ))}
          </div>
        ) : (
          <div className="saved-empty">
            <p>Nothing saved yet.</p>
            <p>
              Tap the bookmark on any story on the{' '}
              <Link to="/">home page</Link> and it will show up here — no
              account needed.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
