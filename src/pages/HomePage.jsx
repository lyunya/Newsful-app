import { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ArticleRow from "../components/ArticleRow";
import { fetchNews, LANES } from "../services/news-api";
import "./HomePage.css";

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
  const [query, setQuery] = useState("");
  const [news, setNews] = useState(EMPTY_NEWS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSlow, setIsSlow] = useState(false);
  const topStories = LANES.map((lane) => news[lane.id]?.[0]).filter(Boolean);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    setError(null);
    setIsSlow(false);
    // Free hosting spins the API down when idle; warn if the wake-up is slow
    const slowTimer = setTimeout(() => setIsSlow(true), 6000);

    fetchNews(query || undefined, abortController.signal)
      .then((results) => {
        setNews(results);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Couldn’t load the news right now. Please try again.");
        setIsLoading(false);
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      clearTimeout(slowTimer);
      abortController.abort();
    };
  }, [query, refreshKey]);

  return (
    <>
      <Header />
      <main className="home-page">
        <div className="hero">
          <div className="hero-copy">
            <h1 className="app-name">Newsful</h1>
            <p className="tagline">
              Whose views are in your news? See how every side covers the same
              story.
            </p>
            <SearchBar
              onSearch={setQuery}
              activeQuery={query}
              onClear={() => setQuery("")}
            />
          </div>
          {!isLoading && !error && topStories.length > 0 && (
            <div className="briefing-panel" aria-label="Top stories">
              {topStories.map((story) => (
                <a
                  className="briefing-link"
                  href={story.url}
                  key={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-lane={story.lane}
                >
                  <span className="briefing-source">{story.source}</span>
                  <span className="briefing-title">{story.title}</span>
                </a>
              ))}
            </div>
          )}
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
            {isSlow && (
              <p className="slow-hint">
                Waking up the news server — the first load of the day can take
                up to a minute…
              </p>
            )}
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
