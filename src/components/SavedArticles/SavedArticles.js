import React, { useEffect, useState, useContext } from "react";
import Article from "../Article/Article";
import NewsfulContext from "../../newsfulcontext";
import Nav from "../Navigation/Header";


const SavedArticles = () => {


  const {savedArticles, setSavedArticles} = useContext(NewsfulContext);

  return (
    <div className="saved-articles">
      <Nav />
      {savedArticles.map((article, index) => {
        return <Article article={article} key={index} />;
      })}
    </div>
  );
};

export default SavedArticles;
