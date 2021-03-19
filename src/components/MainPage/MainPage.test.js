import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { NewsfulContext } from '../App';
import MainPage from './MainPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <NewsfulContext.Provider value={{ savedArticles: [] }}>
      <BrowserRouter>
        <MainPage />
      </BrowserRouter>
    </NewsfulContext.Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
