import React from "react";
import { Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import MainPage from "../MainPage/MainPage";

import SavedArticles from "../SavedArticles/SavedArticles";

library.add(faBookmark);

export const NewsfulContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedArticles: [],
      saveArticle: this.saveArticle,
      userId: 0,
      liberalCount: 0,
      neutralCount: 0,
      conservativeCount: 0,
    };
  }

  saveArticle = (article) => {
    const index = this.state.savedArticles.findIndex(
      (item) => item.id === article.id
    );
    if (index === -1) {
      const newSavedArticles = [...this.state.savedArticles, article];
      this.setState({
        savedArticles: newSavedArticles,
      });
    }
  };

  render() {
    return (
      <div className="App">
        <NewsfulContext.Provider value={this.state}>
          <Switch>
            <Route
              exact
              path={"/"}
              render={() => {
                return <MainPage />;
              }}
            />
            <Route path="/saved-articles" component={SavedArticles} />
          </Switch>
        </NewsfulContext.Provider>
      </div>
    );
  }
}

export default App;
