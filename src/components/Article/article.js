import React from "react";
import "./Article.css"


const Article = ({article}) => {

    return (
      <div className="article">
        <img className="articleImage" alt={'article'} src={article.urlToImage} />
          <p>{article.title}</p>
      </div>
    );
}

export default Article;
