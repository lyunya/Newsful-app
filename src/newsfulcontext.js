import React from "react";

const NewsfulContext = React.createContext({
  savedArticles: [],
  saveArticle: () => {},
  countSavedArticles: () => {},
  username: "",
  userId: 0,
  liberalCount: 0,
  neutralCount: 0,
  conservativeCount: 0,
});

export default NewsfulContext;
