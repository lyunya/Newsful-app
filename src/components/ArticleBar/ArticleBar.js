import React from "react";
import Article from "../Article/Article"
import "./ArticleBar.css"

const ArticleBar = ({ data, heading }) => {

  // const newsArticle = data.map((article, index) => <Article article={article} key={index} />)
    
    return (
      <div className="ArticleBar">
        <h2 className="Bias_heading">{heading}</h2>
        <div className="Bias_content">
        {data.map((article, index) =>
        {
          return <Article article={article} key={index} />
        })}
        </div>
      </div>
    );
}

export default ArticleBar;
