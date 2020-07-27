import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { NewsfulContext } from "../App";
import ArticleBar from "./ArticleBar";

it("renders without crashing", () => {
  const div = document.createElement("div");
    const articles = [
      {
        id: 1,
        title: "This is a test article",
        url: "Test-Url.com",
        image: "test-image.png",
      },
      {
        id: 2,
        title: "This is a test article",
        url: "Test-Url.com",
        image: "test-image.png",
      },
    ];
  ReactDOM.render(
    <BrowserRouter>
      <NewsfulContext.Provider value={{ savedArticles: [] }}>
        <ArticleBar data={articles} />
      </NewsfulContext.Provider>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
