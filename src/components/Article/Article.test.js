import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Article from "./Article";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const article = {
      id: 1,
      title: "This is a test article",
      url: "Test-Url.com",
      image: "test-image.png"
  }
  ReactDOM.render(
    <BrowserRouter>
      <Article article={article} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
