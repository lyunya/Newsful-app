import React, { useRef } from "react";
import scroller from "../../scroller.js";
import Article from "../Article/Article";
import "./ArticleBar.css";

const ArticleBar = ({ data, heading }) => {
  const scrollWrapperRef = useRef();
  const { isDragging } = scroller(scrollWrapperRef);
  const ref = useRef();


  const scroll = (scrollOffset) => {
    scrollWrapperRef.current.scrollLeft += scrollOffset;
    if(scrollWrapperRef.current.scrollLeft > 0){
      //remove hidden class from left paddle
    }
    if(scrollWrapperRef.current.scrollLeft === scrollWrapperRef.current.scrollLeftMax){
      //add hidden class to right paddle
    }
  };

  return (
    <div className="article-bar">
      <h2 className="bias-heading">{heading}</h2>
      <button  className="left-paddle " onClick={() => scroll(-200)}>
        {"<"}
      </button>
      <button className="right-paddle " onClick={() => scroll(200)}>
        {">"}
      </button>
      <div
        className="bias-content"
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
