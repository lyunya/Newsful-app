import { useState } from "react";
import { laneForUrl, sourceForUrl } from "../services/news-api";
import { topicForTitle } from "../services/topics";
import { useSavedArticles } from "../context/SavedArticlesContext";
import "./ArticleCard.css";

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(published) {
  if (!published) return null;
  const date = new Date(published);
  if (Number.isNaN(date.getTime())) return null;
  const minutes = Math.round((date.getTime() - Date.now()) / 60000);
  if (minutes > -60) return relativeTime.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours > -24) return relativeTime.format(hours, "hour");
  return relativeTime.format(Math.round(hours / 24), "day");
}

function BookmarkIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4.5L5 21V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}

// The placeholder art only has a handful of styles; fold topics into them.
const VISUAL_KINDS = {
  politics: "politics",
  law: "politics",
  world: "world",
  sports: "sports",
  science: "science",
  culture: "culture",
};

function visualKind(title) {
  return VISUAL_KINDS[topicForTitle(title).id] ?? "briefing";
}

function StoryVisual({ article, source }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (article.image && !imageFailed) {
    return (
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
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
        />
      </a>
    );
  }

  return (
    <a
      className="story-visual"
      data-kind={visualKind(article.title)}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}
      aria-hidden="true"
    >
      <span className="visual-source">{source}</span>
      <span className="visual-line visual-line-1" />
      <span className="visual-line visual-line-2" />
      <span className="visual-mark" />
    </a>
  );
}

export default function ArticleCard({ article, variant = "standard" }) {
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
      className={variant === "lead" ? "article-card lead-card" : "article-card"}
      data-lane={article.lane || laneForUrl(article.url)}
    >
      <StoryVisual article={article} source={source} />
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
            className={saved ? "bookmark-button saved" : "bookmark-button"}
            onClick={handleToggle}
            aria-pressed={saved}
            aria-label={saved ? "Remove bookmark" : "Bookmark article"}
            title={saved ? "Remove bookmark" : "Bookmark article"}
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
