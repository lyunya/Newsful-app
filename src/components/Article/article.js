import React from "react";
import "./Article.css";

const Article = ({ article }) => {

  return (
    <ul className="articles">
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
            src={article.image}
            onError={(e) => (e.target.style.display = "none")}
          />
          <div className="article__content">
            <div className="article_headline">{article.title}</div>
            {/* <p class="article__text">{article.description}</p> */}
          </div>
        </a>
      </li>
    </ul>
  );
};

export default Article;
