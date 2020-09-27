import React, { Fragment, useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ArticleBar from "../ArticleBar/ArticleBar";
import Nav from "../Navigation/Header";
import {
  conserv_popular_news,
  neutral_popular_news,
  liberal_popular_news,
  conserv_search_news,
  neutral_search_news,
  liberal_search_news,
} from "../../newsful-helpers";
import "./MainPage.css";



const MainPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //makes 3 seperate fetch calls to ensure enough results for each category
  //liberal, conservative, neutral
  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    const abortController = new AbortController();
    const signal = abortController.signal;

    let apiRequest1 = fetch(conserv_popular_news, {
      signal: signal,
    }).then((response) => {
      return response.json();
    });
    let apiRequest2 = fetch(neutral_popular_news, {
      signal: signal,
    }).then((response) => {
      return response.json();
    });
    let apiRequest3 = fetch(liberal_popular_news, {
      signal: signal,
    }).then((response) => {
      return response.json();
    });

    let combinedData = {
      apiRequest1: {},
      apiRequest2: {},
      apiRequest3: {},
    };
    
    Promise.all([apiRequest1, apiRequest2, apiRequest3])
      .then((values) => {
        combinedData["apiRequest1"] = values[0];
        combinedData["apiRequest2"] = values[1];
        combinedData["apiRequest3"] = values[2];
        return combinedData;
      })
      .then((responseJson) => {
        const results = [
          responseJson.apiRequest1.news,
          responseJson.apiRequest2.news,
          responseJson.apiRequest3.news,
        ];
        const finalResults = results.flat();
        setIsLoading(false);
        setArticles(finalResults);
        seperateArticleBias(finalResults);
      })
      .catch((error) => {
        setIsError(true);
        console.error("error:", error);
      });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const search = (query) => {
    setIsLoading(true);
    setIsError(false);
    let apiRequest1 = fetch(`${conserv_search_news}${query}`).then(function (
      response
    ) {
      return response.json();
    });
    let apiRequest2 = fetch(`${neutral_search_news}${query}`).then(function (
      response
    ) {
      return response.json();
    });
    let apiRequest3 = fetch(`${liberal_search_news}${query}`).then(function (
      response
    ) {
      return response.json();
    });
    let combinedData = {
      apiRequest1: {},
      apiRequest2: {},
      apiRequest3: {},
    };
    Promise.all([apiRequest1, apiRequest2, apiRequest3])
      .then(function (values) {
        combinedData["apiRequest1"] = values[0];
        combinedData["apiRequest2"] = values[1];
        combinedData["apiRequest3"] = values[2];
        return combinedData;
      })
      .then((responseJson) => {
        const results = [
          responseJson.apiRequest1.news,
          responseJson.apiRequest2.news,
          responseJson.apiRequest3.news,
        ];
        const finalResults = results.flat();
        setIsLoading(false);
        setArticles(finalResults);
        seperateArticleBias(finalResults);
      })
      .catch((error) => {
        setIsError(true);
        console.error("error:", error);
      });
  };

  //checks the article url to sort into correct category
  const seperateArticleBias = (articles) => {
    const conservative = articles.filter((article) => {
      return (
        article.url.includes("breitbart.com") ||
        article.url.includes("foxnews.com") ||
        article.url.includes("nationalreview.com")
      );
    });
    const neutral = articles.filter((article) => {
      return (
        article.url.includes("reuters.com") ||
        article.url.includes("npr.org") ||
        article.url.includes("bbc.com")
      );
    });
    const liberal = articles.filter((article) => {
      return (
        article.url.includes("msnbc.com") ||
        article.url.includes("huffpost.com") ||
        article.url.includes("cnn.com")
      );
    });

    return { conservative, neutral, liberal };
  };

  const news = seperateArticleBias(articles);

  return (
    <div className="main-page">
      <Nav />
      <h1 className="App-title">Newsful</h1>
      <SearchBar search={search} />
      {isError && <div>Something went wrong...</div>}
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <Fragment>
          <ArticleBar
            className="liberal-bar"
            heading={"Liberal"}
            data={news.liberal}
          />
          <ArticleBar
            className="conservative-bar"
            heading={"Conservative"}
            data={news.conservative}
          />
          <ArticleBar className="neutral-bar" heading={"Neutral"} data={news.neutral} />
        </Fragment>
      )}
    </div>
  );
};

export default MainPage;
