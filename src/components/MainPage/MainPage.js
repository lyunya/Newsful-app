import React, { useEffect, useState } from 'react';
import Nav from '../Navigation/Header';
import SearchBar from '../SearchBar/SearchBar';
import ArticleBar from '../ArticleBar/ArticleBar';
import {
  conserv_popular_news_api,
  neutral_popular_news_api,
  liberal_popular_news_api,
  conserv_search_news_api,
  neutral_search_news_api,
  liberal_search_news_api,
} from '../../newsful-helpers';
import './MainPage.css';

const MainPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // makes 3 seperate fetch calls to ensure enough results for each category
  // liberal, conservative, neutral
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    const abortController = new AbortController();
    const { signal } = abortController;

    Promise.all([
      fetch(conserv_popular_news_api, { signal }),
      fetch(neutral_popular_news_api, { signal }),
      fetch(liberal_popular_news_api, { signal }),
    ])
      .then((responses) =>
        Promise.all(responses.map((response) => response.json()))
      )
      .then((data) => {
        const results = [data[0].news, data[1].news, data[2].news].flat();
        setIsLoading(false);
        setArticles(results);
        seperateArticleBias(results);
      })
      .catch((error) => {
        setIsError(true);
        console.error('error:', error);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const search = (query) => {
    setIsLoading(true);
    setIsError(false);
    const apiRequest1 = fetch(`${conserv_search_news_api}${query}`).then(
      function (response) {
        return response.json();
      }
    );
    const apiRequest2 = fetch(`${neutral_search_news_api}${query}`).then(
      function (response) {
        return response.json();
      }
    );
    const apiRequest3 = fetch(`${liberal_search_news_api}${query}`).then(
      function (response) {
        return response.json();
      }
    );

    Promise.all([apiRequest1, apiRequest2, apiRequest3])
      .then((data) => {
        const results = [data[0].news, data[1].news, data[2].news].flat();
        setIsLoading(false);
        setArticles(results);
        seperateArticleBias(results);
      })
      .catch((error) => {
        setIsError(true);
        console.error('error:', error);
      });
  };

  // checks the article url to sort into correct category
  const seperateArticleBias = (articles) => {
    const conservative = articles.filter(
      (article) =>
        article.url.includes('breitbart.com') ||
        article.url.includes('foxnews.com') ||
        article.url.includes('nationalreview.com')
    );
    const neutral = articles.filter(
      (article) =>
        article.url.includes('reuters.com') ||
        article.url.includes('npr.org') ||
        article.url.includes('bbc.com')
    );
    const liberal = articles.filter(
      (article) =>
        article.url.includes('msnbc.com') ||
        article.url.includes('huffpost.com') ||
        article.url.includes('cnn.com')
    );

    return { conservative, neutral, liberal };
  };

  const news = seperateArticleBias(articles);

  return (
    <>
      <Nav />
      <div className="main-page">
        <h1 className="App-title">Newsful</h1>
        <SearchBar search={search} />
        {isError && <div>Something went wrong...</div>}
        {isLoading ? (
          <>
            <div className="spinner" />
            <p className="loading-message">
              Grabbing news from all over the world...
            </p>
          </>
        ) : (
          <>
            <ArticleBar
              className="liberal-bar"
              heading="Liberal"
              data={news.liberal}
            />
            <ArticleBar
              className="conservative-bar"
              heading="Conservative"
              data={news.conservative}
            />
            <ArticleBar
              className="neutral-bar"
              heading="Neutral"
              data={news.neutral}
            />
          </>
        )}
      </div>
    </>
  );
};

export default MainPage;
