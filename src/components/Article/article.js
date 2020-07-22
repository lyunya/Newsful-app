import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Article.css";
import { NewsfulContext } from "../../components/App";

const Article = ({ article }) => {
  const contextValue = useContext(NewsfulContext);


  const setSavedArticle = (article) => {
    contextValue.saveArticle(article);
      if (article.url.includes("msnbc.com" || "huffpost.com" || "cnn.com")) {
        contextValue.liberalCount = contextValue.liberalCount + 1;
      }
      if (article.url.includes("reuters.com" || "npr.com" || "bbc.com")) {
        contextValue.neutralCount = contextValue.neutralCount + 1;
      }
      if (
        article.url.includes("foxnews.com" || "nationalreview.com" || "breitbart.com")
      ) {
        contextValue.conservativeCount = contextValue.conservativeCount + 1;
      }
  };

  return (
    <div className="articles">
      <div className="article-item">
        <div className="article">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <img
              className="article-image"
              alt={"article"}
              src={article.image}
              onError={(e) => (e.target.style.display = "none")}
            />
          </a>
          <div className="article-content">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <div className="article_headline">{article.title}</div>
            </a>
            <FontAwesomeIcon
              icon={"bookmark"}
              className="bookmark"
              onClick={() => setSavedArticle(article)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
