import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import NewsfulContext from '../../context/NewsfulContext';

import SavedArticles from './SavedArticles';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <NewsfulContext.Provider value={{ savedArticles: [] }}>
        <SavedArticles />
      </NewsfulContext.Provider>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
