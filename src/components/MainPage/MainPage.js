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

    // const apiRequest1 = { ...conservativeData, bias: "conservative" };
    // const apiRequest2 = { ...neutralData, bias: "neutral" };
    // const apiRequest3 = { ...liberalData, bias: "liberal" };
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

  const seperateArticleBias = (articles) => {
    const conservative = articles.filter((article) => {
      return (
        article.url.includes("breitbart") ||
        article.url.includes("foxnews") ||
        article.url.includes("nationalreview.com")
      );
    });
    const neutral = articles.filter((article) => {
      return (
        article.url.includes("bbc") ||
        article.url.includes("apnews") ||
        article.url.includes("usatoday")
      );
    });
    const liberal = articles.filter((article) => {
      return (
        article.url.includes("msnbc") ||
        article.url.includes("huffpost") ||
        article.url.includes("cnn")
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
          <ArticleBar heading={"Liberal"} data={news.liberal} />
          <ArticleBar heading={"Conservative"} data={news.conservative} />
          <ArticleBar heading={"Neutral"} data={news.neutral} />
        </Fragment>
      )}
    </div>
  );
};

export default MainPage;
