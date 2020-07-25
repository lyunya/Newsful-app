import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Article.css";
import { NewsfulContext } from "../App";
import TokenService from "../../services/token-service";
import useDeviceDetect from "../../useDeviceDetect";
import config from "../../config";

const Article = ({ article }) => {
  const contextValue = useContext(NewsfulContext);
  const [isError, setIsError] = useState(false);
  const { isMobile } = useDeviceDetect();

  const setSavedArticle = (article) => {
    const savedArticle = {
      title: article.title,
      url: article.url,
      image: article.image,
      user_id: contextValue.user_id,
    };
    fetch(`${config.API_ENDPOINT}/saved-articles`, {
      method: "POST",
      body: JSON.stringify(savedArticle),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            console.log(`Error is: ${error}`);
            throw error;
          });
        }
        return res.json();
      })
      .then((data) => {
        contextValue.saveArticle(data);
        checkSaved(article);
      })
      .catch((error) => {
        setIsError(error);
      });
    contextValue.countUpSavedArticles(article);
  };

  const deleteSavedArticle = (article) => {
    contextValue.countDownSavedArticles(article);
    fetch(`${config.API_ENDPOINT}/saved-articles/${article.id}`, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        }
      })
      .then(() => {
        contextValue.deleteSave(article);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const checkSaved = (article) => {
    return contextValue.savedArticles.find((a) => a.url === article.url);
  };

  // const style = checkSaved(article) ? "fas" : "far";

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
            {checkSaved(article) ? (
              <FontAwesomeIcon
                icon={["fas", "bookmark"]}
                className="bookmark"
                onClick={() => deleteSavedArticle(article)}
                size={isMobile ? "1.2x" : "1x"}
              />
            ) : (
              <FontAwesomeIcon
                icon={["far", "bookmark"]}
                className="bookmark"
                onClick={() => setSavedArticle(article)}
                size={isMobile ? "1.2x" : "1x"}
              />
            )}
          </div>
          {isError ? <div>Unable to save</div> : null}
        </div>
      </div>
    </div>
  );
};

export default Article;
