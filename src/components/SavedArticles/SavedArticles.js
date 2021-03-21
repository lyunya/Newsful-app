import React, { useContext } from 'react';
import Article from '../Article/Article';
import Nav from '../Navigation/Header';
import NewsfulContext from '../../context/NewsfulContext';

import './SavedArticles.css';

const SavedArticles = () => {
  const { savedArticles, darkMode } = useContext(NewsfulContext);

  return (
    <>
      <Nav />
      <div className={darkMode ? 'saved-articles-dark' : 'saved-articles'}>
        <h1 className={darkMode ? 'saved-articles-name-dark' : 'saved-articles-name'}>
          Saved Articles
        </h1>
        <main className='main'>
          {savedArticles.map((article, index) => (
            <Article article={article} key={index} />
          ))}
        </main>
      </div>
    </>
  );
};

export default SavedArticles;
