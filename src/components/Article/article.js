import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Article.css";
import NewsfulContext from "../../newsfulcontext";

const Article = ({ article }) => {
// const [savedArticle, setSavedArticle] = useContext(NewsfulContext)

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
            <FontAwesomeIcon icon={"bookmark"} className="bookmark" /*onClick={() => setSavedArticle(article)} */ />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
