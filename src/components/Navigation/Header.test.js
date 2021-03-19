import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { NewsfulContext } from '../App';
import Header from './Header';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <NewsfulContext.Provider value={{ savedArticles: [] }}>
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </NewsfulContext.Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
