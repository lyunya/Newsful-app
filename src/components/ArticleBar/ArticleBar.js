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
      <div className="articlebar-header">
        <h2 className="bias-heading">{heading}</h2>
        <div className="arrows">
          <div className="left-paddle" onClick={() => scroll(-200)}>
            {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="5" y1="12" x2="9" y2="16" />
                <line x1="5" y1="12" x2="9" y2="8" />
              </svg>
            }
          </div>
          <div className="right-paddle " onClick={() => scroll(200)}>
            {
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="15" y1="16" x2="19" y2="12" />
                <line x1="15" y1="8" x2="19" y2="12" />
              </svg>
            }
          </div>
        </div>
      </div>
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
