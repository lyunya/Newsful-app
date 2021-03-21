import React, { useRef, useContext } from 'react';
import scroller from '../../scroller.js';
import Article from '../Article/Article';
import NewsfulContext from '../../context/NewsfulContext';
import useDeviceDetect from '../../useDeviceDetect';
import leftArrow from '../../images/leftArrow.svg';
import rightArrow from '../../images/rightArrow.svg';
import './ArticleBar.css';

const ArticleBar = ({ data, heading }) => {
  const { darkMode } = useContext(NewsfulContext);
  const scrollWrapperRef = useRef();
  const { isMobile } = useDeviceDetect();

  const scrollMobile = () => (isMobile ? scroller(scrollWrapperRef) : null);

  const scroll = (scrollOffset) => {
    scrollWrapperRef.current.scrollLeft += scrollOffset;
  };

  // add class name for styling purposes
  const articleBarClasses = ['bias-heading'];

  const style = () => {
    /Liberal/.test(heading)
      ? articleBarClasses.push('liberal')
      : /Conservative/.test(heading)
      ? articleBarClasses.push('conservative')
      : articleBarClasses.push('neutral');
  };

  return (
    <div className='article-bar'>
      <div className='articlebar-header'>
        {style()}
        <h2 className={articleBarClasses.join(' ')}>{heading}</h2>
        {scrollMobile}
        {!isMobile ? (
          <div className='arrows'>
            <div className='left-paddle' onClick={() => scroll(-200)}>
              <img className='left-arrow' src={leftArrow} alt='left arrow' />
            </div>
            <div className='right-paddle' onClick={() => scroll(200)}>
              <img className='right-arrow' src={rightArrow} alt='right arrow' />
            </div>
          </div>
        ) : null}
      </div>
      <div className='bias-content' ref={scrollWrapperRef}>
        {data.length > 0 ? (
          data.map((article, index) => (
            <Article article={article} key={index} />
          ))
        ) : (
          <div className='error-message'>
            No results. Try another search topic!
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleBar;
