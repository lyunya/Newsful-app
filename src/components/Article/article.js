import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Article.css";
import { NewsfulContext } from "../../components/App";

const Article = ({ article }) => {
  const contextValue = useContext(NewsfulContext);

  const setSavedArticle = (article) => {
    checkSaved(article);
    contextValue.saveArticle(article);
    contextValue.countSavedArticles(article);
  };

  const checkSaved = (article) => {
    console.log(article)
    contextValue.savedArticles.find((a) => a.id === article.id);
  };

  const style = checkSaved(article) ? "fas" : "far";

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
              icon={[style, "bookmark"]}
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
