import React, { useContext } from "react";
import Article from "../Article/Article";
import { NewsfulContext} from "../../components/App";
import Nav from "../Navigation/Header";
import "./SavedArticles.css"


const SavedArticles = () => {
  const {savedArticles} = useContext(NewsfulContext);

  console.log(savedArticles)

  return (
    <div className="saved-articles">
      <Nav />
      <h1>Saved Articles</h1>
      <main className="main">
        {savedArticles.map((article, index) => {
          return <Article article={article} key={index} />;
        })}
      </main>
    </div>
  );
};

export default SavedArticles;
