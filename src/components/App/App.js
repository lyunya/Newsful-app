import React, { Component, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import MainPage from "../MainPage/MainPage";
import NewsfulContext from "../../newsfulcontext";
import SavedArticles from "../SavedArticles/SavedArticles";
library.add(faBookmark);

const App = () => {
const {savedArticles, setSavedArticle} = useContext(NewsfulContext);

  

  return (
    <div className="App">
      <NewsfulContext.Provider value={{ savedArticles, setSavedArticle }}>
        <Switch>
          <Route
            exact
            path={"/"}
            render={() => {
              return <MainPage />;
            }}
          />
          <Route path='/saved-articles' component={SavedArticles} />
        </Switch>
      </NewsfulContext.Provider>
    </div>
  );
};

export default App;
