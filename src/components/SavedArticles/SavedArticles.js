import React, { useContext } from "react";
import Article from "../Article/Article";
import { NewsfulContext } from "../../components/App";
import Nav from "../Navigation/Header";
import "./SavedArticles.css";

const SavedArticles = () => {
  const { savedArticles } = useContext(NewsfulContext);
  const contextValue = useContext(NewsfulContext);

  return (
    <>
      <Nav />
      <div className="saved-articles">
        <h1>Saved Articles</h1>
        <p>
          You have saved {contextValue.liberalCount} liberal,{" "}
          {contextValue.neutralCount} neutral, and{" "}
          {contextValue.conservativeCount} conservative articles
        </p>
        <main className="main">
          {savedArticles.map((article, index) => {
            return <Article article={article} key={index} />;
          })}
        </main>
      </div>
    </>
  );
};

export default SavedArticles;
