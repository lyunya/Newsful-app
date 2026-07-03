import { useState } from 'react';
import { laneForUrl, sourceForUrl } from '../services/news-api';
import { useSavedArticles } from '../context/SavedArticlesContext';
import './ArticleCard.css';

const relativeTime = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function timeAgo(published) {
  if (!published) return null;
  // Currents returns e.g. "2026-07-03 04:12:11 +0000"
  const date = new Date(published.replace(' ', 'T').replace(' +0000', 'Z'));
  if (Number.isNaN(date.getTime())) return null;
  const minutes = Math.round((date.getTime() - Date.now()) / 60000);
  if (minutes > -60) return relativeTime.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (hours > -24) return relativeTime.format(hours, 'hour');
  return relativeTime.format(Math.round(hours / 24), 'day');
}

function BookmarkIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export default function ArticleCard({ article }) {
  const { isSaved, toggleSave } = useSavedArticles();
  const [saveError, setSaveError] = useState(false);
  const saved = isSaved(article.url);
  const source = article.source || sourceForUrl(article.url);
  const published = timeAgo(article.published);

  const handleToggle = async () => {
    setSaveError(false);
    try {
      await toggleSave(article);
    } catch {
      setSaveError(true);
    }
  };

  return (
    <article
      className="article-card"
      data-lane={article.lane || laneForUrl(article.url)}
    >
      {article.image && (
        <a
          className="card-image-link"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            className="card-image"
            src={article.image}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.target.closest('.card-image-link').style.display = 'none';
            }}
          />
        </a>
      )}
      <div className="card-body">
        <a
          className="card-headline"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {article.title}
        </a>
        <div className="card-footer">
          <span className="card-meta">
            {source}
            {published && <span className="card-time"> · {published}</span>}
          </span>
          <button
            type="button"
            className={saved ? 'bookmark-button saved' : 'bookmark-button'}
            onClick={handleToggle}
            aria-pressed={saved}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark article'}
            title={saved ? 'Remove bookmark' : 'Bookmark article'}
          >
            <BookmarkIcon filled={saved} />
          </button>
        </div>
        {saveError && (
          <p className="card-error">Couldn’t update bookmark. Try again.</p>
        )}
      </div>
    </article>
  );
}
