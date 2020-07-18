import React, { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ArticleBar from "../ArticleBar/ArticleBar";
import Nav from "../Navigation/Header"
import { new_popular_news, conserv_search_news, neutral_search_news, liberal_search_news } from "../../newsful-helpers";
import "./MainPage.css";

const MainPage = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(new_popular_news)
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((responseJson) => {
        console.log(responseJson.news)
        setArticles(responseJson.news);
        seperateArticleBias(responseJson.news);
      });
  }, []);

  const search = (query) => {
    Promise.all([
      fetch(`${conserv_search_news}${query}`),
      fetch(`${neutral_search_news}${query}`),
      fetch(`${liberal_search_news}${query}`)
    ])
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((responseJson) => {
        console.log(responseJson.news)
        setArticles(responseJson.news);
        seperateArticleBias(responseJson.news);
      });
  };

  const seperateArticleBias = (articles) => {
    const conservative = articles.filter((article) => {
      return (
        article.author === "@BreitbartNews" ||
        article.author === "Fox News" ||
        article.author.includes("nationalreview.com")
      );
    });
    const neutral = articles.filter((article) => {
      return (
        article.author === "go" ||
        article.author === "Associated Press" ||
        article.author === "@usatoday"
      );
    });
    const liberal = articles.filter((article) => {
      return (
        article.author === "MSNBC" ||
        article.author === "huffpost" ||
        article.author === "cnn"
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
