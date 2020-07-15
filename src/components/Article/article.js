import React from "react";


const Article = ({article}) => {

    return (
      <div className="Article">
          <p>{article.title}</p>
      </div>
    );
}

export default Article;
