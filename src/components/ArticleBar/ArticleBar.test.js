import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
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
      <ArticleBar data={articles} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
