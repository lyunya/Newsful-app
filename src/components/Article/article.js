import React from "react";
import "./Article.css";

const Article = ({ article }) => {

  return (
    <li className="article__item">
      <a
        className="article"
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          className="article_image"
          alt={"article"}
          src={article.urlToImage}
          onError={(e) => e.target.style.display='none'}
        />
        <div className="article__content">
          <div class="article_headline">{article.title}</div>
          <p class="article__text">{article.description}</p>
        </div>
      </a>
    </li>
  );
};

export default Article;
