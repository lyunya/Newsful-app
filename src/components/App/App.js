import React from "react";
import { Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark as fasBookmark} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import "./App.css";
import MainPage from "../MainPage/MainPage";

import SavedArticles from "../SavedArticles/SavedArticles";

library.add(fasBookmark, farBookmark);

export const NewsfulContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedArticles: [],
      saveArticle: this.saveArticle,
      countSavedArticles: this.countSavedArticles,
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

  countSavedArticles = (article) => {
    const index = this.state.savedArticles.findIndex(
      (item) => item.id === article.id
    );
    if (index === -1) {
      if (article.url.includes("msnbc.com" || "huffpost.com" || "cnn.com")) {
       this.setState({liberalCount: this.state.liberalCount + 1})
      }
    if (article.url.includes("reuters.com" || "npr.com" || "bbc.com")) {
      this.setState({ neutralCount: this.state.neutralCount + 1 });
    }
    if (
      article.url.includes(
        "foxnews.com" || "nationalreview.com" || "breitbart.com"
      )
    ) {
      this.setState({ conservativeCount: this.state.conservativeCount + 1 });
    }
  }
}

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
