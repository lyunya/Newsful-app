import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Article.css';
import { NewsfulContext } from '../App';
import TokenService from '../../services/token-service';
import useDeviceDetect from '../../useDeviceDetect';
import config from '../../config';

const Article = ({ article }) => {
  const { user_id, saveArticle, savedArticles, darkMode } = useContext(
    NewsfulContext
  );
  const [isError, setIsError] = useState(false);
  const { isMobile } = useDeviceDetect();

  const setSavedArticle = (article) => {
    const savedArticle = {
      title: article.title,
      url: article.url,
      image: article.image,
      user_id: user_id,
    };
    fetch(`${config.API_ENDPOINT}/saved-articles`, {
      method: 'POST',
      body: JSON.stringify(savedArticle),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            setIsError(error);
            throw error;
          });
        }
        return res.json();
      })
      .then((data) => {
        saveArticle(data);
        checkSaved(article);
      })
      .catch((error) => {
        setIsError(error);
      });
  };

  const deleteSavedArticle = (article) => {
    let articleId;
    savedArticles.forEach((savedArticle) => {
      if (savedArticle.url === article.url) {
        articleId = savedArticle.id;
      }
    });

    fetch(`${config.API_ENDPOINT}/saved-articles/${articleId}`, {
      method: 'DELETE',
      headers: {
        'content-Type': 'application/json',
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((e) => Promise.reject(e));
        }
      })
      .then(() => {
        deleteSave(article);
        checkSaved(article);
      })
      .catch((error) => {
        setIsError(error);
      });
  };

  // this determines which bookmark icon to show if saved or not
  const checkSaved = (article) => 
    savedArticles.find((a) => a.url === article.url);
  
    
  const articleClasses = darkMode ? ['article-dark-mode'] : ['article'];

  const style = () => {
    /msnbc.com/.test(article.url) ||
    /huffpost.com/.test(article.url) ||
    /cnn.com/.test(article.url)
      ? articleClasses.push('liberal')
      : /foxnews.com/.test(article.url) ||
        /breitbart.com/.test(article.url) ||
        /nationalreview.com/.test(article.url)
      ? articleClasses.push('conservative')
      : articleClasses.push('neutral');
  };

  return (
    <div className="articles">
      <div className='article-item'>
        {style()}
        <div className={articleClasses.join(' ')}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <img
              className="article-image"
              alt="article"
              src={article.image}
              onError={(e) => (e.target.style.display = 'none')}
            />
          </a>
          <div className="article-content">
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <div className={darkMode ? "article_headline-dark" : "article_headline"}>{article.title}</div>
            </a>

            {checkSaved(article) ? (
              <FontAwesomeIcon
                icon={['fas', 'bookmark']}
                className="bookmark"
                title="remove bookmark"
                onClick={() => deleteSavedArticle(article)}
                size={isMobile ? 'lg' : '1x'}
              />
            ) : (
              <FontAwesomeIcon
                icon={['far', 'bookmark']}
                className="bookmark"
                title="bookmark"
                onClick={() => setSavedArticle(article)}
                size={isMobile ? 'lg' : '1x'}
              />
            )}
          </div>
          {isError ? <div>Sorry! Bookmarks not working right now</div> : null}
        </div>
      </div>
    </div>
  );
};

export default Article;
