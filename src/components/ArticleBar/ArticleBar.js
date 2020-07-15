import React from "react";
import Article from "../Article/Article"

const ArticleBar = ({ data, heading }) => {

  const newsArticle = data.map((article, index) => <Article article={article} key={index} />)
    
    return (
      <div className="ArticleBar">
        <h2>{heading}</h2>
        {data.map((article, index) =>
        {
          return <Article article={article} key={index} />
        })}
      </div>
    );
}

export default ArticleBar;
