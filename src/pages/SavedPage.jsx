import { Link } from "react-router-dom";
import Header from "../components/Header";
import ArticleCard from "../components/ArticleCard";
import { useAuth } from "../context/AuthContext";
import { useSavedArticles } from "../context/SavedArticlesContext";
import { LANES, laneForUrl } from "../services/news-api";
import { topicForTitle } from "../services/topics";
import "./SavedPage.css";

const LANE_LABELS = Object.fromEntries(
  LANES.map((lane) => [lane.id, lane.label]),
);

const SOURCE_LANES = {
  "ms now": "liberal",
  msnbc: "liberal",
  huffpost: "liberal",
  cnn: "liberal",
  "fox news": "conservative",
  foxnews: "conservative",
  breitbart: "conservative",
  "national review": "conservative",
  bbc: "neutral",
  npr: "neutral",
  reuters: "neutral",
};

function laneForArticle(article) {
  if (article.lane && LANE_LABELS[article.lane]) return article.lane;

  const urlLane = laneForUrl(article.url);
  if (urlLane !== "neutral") return urlLane;

  const source = String(article.source ?? "").toLowerCase();
  const matched = Object.entries(SOURCE_LANES).find(([name]) =>
    source.includes(name),
  );
  return matched?.[1] ?? urlLane;
}

function groupedSavedArticles(articles) {
  const lanes = LANES.map((lane) => ({
    ...lane,
    topics: new Map(),
    count: 0,
  }));

  const byLane = Object.fromEntries(lanes.map((lane) => [lane.id, lane]));

  articles.forEach((article) => {
    const laneId = laneForArticle(article);
    const lane = byLane[laneId] ?? byLane.neutral;
    const topic = topicForTitle(article.title ?? "");
    const topicGroup = lane.topics.get(topic.id) ?? {
      ...topic,
      articles: [],
    };
    topicGroup.articles.push({ ...article, lane: lane.id });
    lane.topics.set(topic.id, topicGroup);
    lane.count += 1;
  });

  return lanes
    .filter((lane) => lane.count > 0)
    .map((lane) => ({
      ...lane,
      topics: Array.from(lane.topics.values()).sort((a, b) =>
        a.label.localeCompare(b.label),
      ),
    }));
}

export default function SavedPage() {
  const { user } = useAuth();
  const { savedArticles, isLoading, error } = useSavedArticles();
  const groupedArticles = groupedSavedArticles(savedArticles);

  return (
    <>
      <Header />
      <main className="saved-page">
        <h1 className="saved-title">Saved articles</h1>

        {!user && savedArticles.length > 0 && (
          <p className="saved-hint">
            Bookmarks are stored on this device. <Link to="/login">Log in</Link>{" "}
            to keep them everywhere.
          </p>
        )}

        {error && (
          <p className="saved-error" role="alert">
            {error}
          </p>
        )}

        {savedArticles.length > 0 ? (
          <div className="saved-sections">
            {groupedArticles.map((lane) => (
              <section
                className="saved-lane"
                data-lane={lane.id}
                key={lane.id}
                aria-label={`${lane.label} saved articles`}
              >
                <div className="saved-lane-header">
                  <h2>{lane.label}</h2>
                  <span>
                    {lane.count} {lane.count === 1 ? "article" : "articles"}
                  </span>
                </div>

                {lane.topics.map((topic) => (
                  <section className="saved-topic" key={topic.id}>
                    <div className="saved-topic-header">
                      <h3>{topic.label}</h3>
                      <span>{topic.articles.length}</span>
                    </div>
                    <div className="saved-grid">
                      {topic.articles.map((article) => (
                        <ArticleCard article={article} key={article.url} />
                      ))}
                    </div>
                  </section>
                ))}
              </section>
            ))}
          </div>
        ) : isLoading ? (
          <div className="saved-empty" role="status">
            <p>Loading your saved articles…</p>
          </div>
        ) : (
          <div className="saved-empty">
            <p>Nothing saved yet.</p>
            <p>
              Tap the bookmark on any story on the <Link to="/">home page</Link>{" "}
              and it will show up here — no account needed.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
