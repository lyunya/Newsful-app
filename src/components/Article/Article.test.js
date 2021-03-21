import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import NewsfulContext from '../../context/NewsfulContext';
import Article from './Article';

it('renders without crashing', () => {
  const div = document.createElement('div');
  //   const contextValue = useContext(NewsfulContext);
  const article = {
    id: 1,
    title: 'This is a test article',
    url: 'Test-Url.com',
    image: 'test-image.png',
  };
  ReactDOM.render(
    <BrowserRouter>
      <NewsfulContext.Provider value={{ savedArticles: [] }}>
        <Article article={article} />
      </NewsfulContext.Provider>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
