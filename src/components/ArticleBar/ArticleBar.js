import React, { useRef } from "react";
import scroller from "../../scroller.js";
import Article from "../Article/Article";
import "./ArticleBar.css";

const ArticleBar = ({ data, heading }) => {
const scrollWrapperRef = useRef();
const { isDragging } = scroller(scrollWrapperRef);
const ref = useRef();

const scroll = (scrollOffset) => {
  ref.current.scrollLeft += scrollOffset;
};

  return (
    <div className="ArticleBar">
      <h2 className="Bias_heading">{heading}</h2>
      {/* <button onClick={() => scroll(-20)}>left</button>
      <button onClick={() => scrollWrapperRef}>right</button> */}
      <div
        className="Bias_content"
        ref={scrollWrapperRef}
        // style={{ pointerEvents: isDragging ? "none" : undefined }}
      >
        {data.map((article, index) => {
          return <Article article={article} key={index} />;
        })}
      </div>
    </div>
  );
};

export default ArticleBar;
