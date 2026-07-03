import { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ArticleRow from '../components/ArticleRow';
import { fetchNews, LANES } from '../services/news-api';
import './HomePage.css';

const EMPTY_NEWS = { liberal: [], conservative: [], neutral: [] };

function SkeletonRow() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <div className="skeleton-heading" />
      <div className="skeleton-cards">
        {Array.from({ length: 6 }, (_, i) => (
          <div className="skeleton-card" key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [news, setNews] = useState(EMPTY_NEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchNews(query || undefined, abortController.signal)
      .then((results) => {
        setNews(results);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError('Couldn’t load the news right now. Please try again.');
        setIsLoading(false);
      });

    return () => abortController.abort();
  }, [query, refreshKey]);

  return (
    <>
      <Header />
      <main className="home-page">
        <div className="hero">
          <h1 className="app-name">Newsful</h1>
          <p className="tagline">
            Whose views are in your news? See how every side covers the same
            story.
          </p>
          <SearchBar
            onSearch={setQuery}
            activeQuery={query}
            onClear={() => setQuery('')}
          />
        </div>

        {error && (
          <div className="page-error" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="retry-button"
              onClick={() => setRefreshKey((key) => key + 1)}
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="rows">
            {LANES.map((lane) => (
              <SkeletonRow key={lane.id} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="rows">
              {LANES.map((lane) => (
                <ArticleRow
                  key={lane.id}
                  laneId={lane.id}
                  heading={lane.label}
                  articles={news[lane.id]}
                />
              ))}
            </div>
          )
        )}
      </main>
    </>
  );
}
