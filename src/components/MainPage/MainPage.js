import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ArticleBar from "../ArticleBar/ArticleBar";
import Nav from "../Navigation/Header"
import { popular_news, search_news } from "../../newsful-helpers";
import "./MainPage.css";

const MainPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(popular_news)
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((responseJson) => {
        setArticles(responseJson.articles);
        seperateArticleBias(responseJson.articles);
      });
  }, []);

  const search = (query) => {
    fetch(
      `${search_news}${query}`
    )
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((responseJson) => {
        console.log(responseJson.articles)
        setArticles(responseJson.articles);
        seperateArticleBias(responseJson.articles);
      });
  };

  const seperateArticleBias = (articles) => {
    const conservative = articles.filter((article) => {
      return (
        article.source.id === "breitbart-news" ||
        article.source.id === "fox-news" ||
        article.source.id === "national-review"
      );
    });
    const neutral = articles.filter((article) => {
      return (
        article.source.id === "abc-news" ||
        article.source.id === "associated-press" ||
        article.source.id === "usa-today"
      );
    });
    const liberal = articles.filter((article) => {
      return (
        article.source.id === "msnbc" ||
        article.source.id === "the-huffington-post" ||
        article.source.id === "cnn"
      );
    });
    return { conservative, neutral, liberal };
  };

  const news = seperateArticleBias(articles)
  
  return (
    <div className="MainPage">
      <Nav />
      <h1 className="App-title">Newsful</h1>
      <SearchBar search={search} />
      <ArticleBar heading={"Liberal"} data={news.liberal} />
      <ArticleBar heading={"Neutral"} data={news.neutral} />
      <ArticleBar heading={"Conservative"} data={news.conservative} />
    </div>
  );
};

export default MainPage;
