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
      deleteSave: this.deleteSave,
      countUpSavedArticles: this.countUpSavedArticles,
      countDownSavedArticles: this.countDownSavedArticles,
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

  deleteSave = (article) => {
    const newSavedArticles = this.state.savedArticles.filter(
      (item) => item.id !== article.id
    );
    this.setState({ savedArticles: newSavedArticles });
  };

  //create three .includes for each condition
  countUpSavedArticles = (article) => {
    const index = this.state.savedArticles.findIndex(
      (item) => item.id === article.id
    );
    if (index === -1) {
      if (article.url.includes("msnbc.com" || "huffpost.com" || "cnn.com")) {
        this.setState({ liberalCount: this.state.liberalCount + 1 });
      }
      if (article.url.includes("reuters.com" || "npr.com" || "bbc.com")) {
        this.setState({ neutralCount: this.state.neutralCount + 1 });
      }
      if (
        article.url.includes(
          "foxnews.com" || "nationalreview.com" || "breitbart"
        ) ||
        article.author.includes("@BreitbartNews")
      ) {
        this.setState({ conservativeCount: this.state.conservativeCount + 1 });
      }
    }
  };

  countDownSavedArticles = (article) => {
    console.log(article)
    const index = this.state.savedArticles.findIndex(
      (item) => item.id === article.id
    );
    if (index === -1) {
      if (article.url.includes("msnbc.com" || "huffpost.com" || "cnn.com")) {
        this.setState({ liberalCount: this.state.liberalCount - 1 });
      }
      if (article.url.includes("reuters.com" || "npr.com" || "bbc.com")) {
        this.setState({ neutralCount: this.state.neutralCount - 1 });
      }
      if (
        article.url.includes(
          "foxnews.com" || "nationalreview.com" || "breitbart"
        ) ||
        article.author.includes("@BreitbartNews")
      ) {
        this.setState({ conservativeCount: this.state.conservativeCount - 1 });
      }
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
