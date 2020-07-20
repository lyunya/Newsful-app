import React from "react";

const NewsfulContext = React.createContext({
  savedArticles: [],
  saveArticle: () => {},
  username: '',
  userId: 0
});

export default NewsfulContext;
