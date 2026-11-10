import { useEffect, useState } from "react";
import { fetchStories, LANES } from "../services/news-api";
import "./StoryCompare.css";

const INITIAL_COUNT = 3;

function LaneColumn({ lane, articles }) {
  return (
    <div className="story-lane" data-lane={lane.id}>
      <h4 className="story-lane-label">{lane.label}</h4>
      {articles.length > 0 ? (
        <ul className="story-headlines">
          {articles.map((article) => (
            <li key={article.url}>
              <span className="story-source">{article.source}</span>
              <a
                className="story-headline"
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="story-missing">No coverage found</p>
      )}
    </div>
  );
}

// The same event as reported by each lane, side by side. The section is an
// extra on top of the lanes below, so it stays out of the way when the
// stories can't be loaded or nothing matched.
export default function StoryCompare() {
  const [stories, setStories] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    fetchStories(abortController.signal)
      .then((result) => setStories(result.stories ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") setStories([]);
      });
    return () => abortController.abort();
  }, []);

  if (stories === null) {
    return (
      <div className="story-compare" aria-hidden="true">
        <div className="story-skeleton" />
      </div>
    );
  }
  if (stories.length === 0) return null;

  const visible = showAll ? stories : stories.slice(0, INITIAL_COUNT);

  return (
    <section className="story-compare" aria-labelledby="story-compare-heading">
      <div className="story-compare-header">
        <h2 id="story-compare-heading">Same story, three views</h2>
        <p>Stories several outlets are covering right now.</p>
      </div>

      <div className="story-list">
        {visible.map((story) => (
          <article className="story" key={story.id}>
            <div className="story-header">
              <h3 className="story-title">{story.title}</h3>
              <span className="story-outlets">
                {story.outletCount} outlets
              </span>
            </div>
            <div className="story-lanes">
              {LANES.map((lane) => (
                <LaneColumn
                  key={lane.id}
                  lane={lane}
                  articles={story.lanes[lane.id] ?? []}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      {stories.length > INITIAL_COUNT && (
        <button
          type="button"
          className="story-toggle"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
        >
          {showAll ? "Show fewer stories" : `Show all ${stories.length} stories`}
        </button>
      )}
    </section>
  );
}
