import { useRef } from 'react';
import ArticleCard from './ArticleCard';
import './ArticleRow.css';

export default function ArticleRow({ laneId, heading, articles }) {
  const scrollerRef = useRef(null);

  const scrollBy = (direction) => {
    scrollerRef.current?.scrollBy({ left: direction * 560, behavior: 'smooth' });
  };

  return (
    <section className="article-row" aria-label={`${heading} news`}>
      <div className="row-header">
        <h2 className="row-heading" data-lane={laneId}>
          {heading}
        </h2>
        <div className="row-arrows">
          <button
            type="button"
            className="row-arrow"
            onClick={() => scrollBy(-1)}
            aria-label={`Scroll ${heading} news left`}
          >
            ‹
          </button>
          <button
            type="button"
            className="row-arrow"
            onClick={() => scrollBy(1)}
            aria-label={`Scroll ${heading} news right`}
          >
            ›
          </button>
        </div>
      </div>
      <div className="row-scroller" ref={scrollerRef}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard article={article} key={article.url} />
          ))
        ) : (
          <p className="row-empty">No results here. Try another search topic!</p>
        )}
      </div>
    </section>
  );
}
