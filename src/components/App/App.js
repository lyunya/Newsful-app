import React from "react";
import { Route, Switch } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import "./App.css";
import MainPage from "../MainPage/MainPage";
import LoginForm from "../LoginForm/LoginForm";
import SavedArticles from "../SavedArticles/SavedArticles";
import TokenService from "../../services/token-service";
import Config from "../../config";
const API = Config.API_ENDPOINT;

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
      userId: this.userId,
      liberalCount: 0,
      neutralCount: 0,
      conservativeCount: 0,
      error: null
    };
  }

  componentDidMount() {
    const token = TokenService.hasAuthToken();
    if (token) {
      this.fetchData(localStorage.getItem("userId"));
    }
  }

countSavedArticles(){
  this.state.savedArticles.map((article) => {
    if (
      /msnbc/.test(article.url) ||
      /huffpost/.test(article.url) ||
      /cnn/.test(article.url)
    ) {
      this.setState({ liberalCount: this.state.liberalCount + 1 });
    }
    if (
      /reuters/.test(article.url) ||
      /npr/.test(article.url) ||
      /bbc/.test(article.url)
    ) {
      this.setState({ neutralCount: this.state.neutralCount + 1 });
    }
    if (
      /foxnews/.test(article.url) ||
      /breitbart/.test(article.url) ||
      /nationalreview/.test(article.url)
    ) {
      this.setState({ conservativeCount: this.state.conservativeCount + 1 });
    }
  });
}
  fetchData = (userId) => {
    console.log(userId)
    this.setState({
      userId,
    });
    fetch(`${API}/saved-articles`)
      .then((articlesRes) => articlesRes.json())
      .then((savedArticles) => {
        this.setState({
          savedArticles: savedArticles.filter(
            (article) => article.user_id.toString() === userId.toString()
          ),
        })
        this.countSavedArticles();
      }).catch((res) => {
          this.setState({ error: res.error });
        });
  };

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


  countUpSavedArticles = (article) => {
    const index = this.state.savedArticles.findIndex(
      (item) => item.id === article.id
    );
    if (index === -1) {
      if (
        /msnbc/.test(article.url) ||
        /huffpost/.test(article.url) ||
        /cnn/.test(article.url)
      ) {
        this.setState({ liberalCount: this.state.liberalCount + 1 });
      }
      if (
        /reuters/.test(article.url) ||
        /npr/.test(article.url) ||
        /bbc/.test(article.url)
      ) {
        this.setState({ neutralCount: this.state.neutralCount + 1 });
      }
      if (
        /foxnews/.test(article.url) ||
        /breitbart/.test(article.url) ||
        /nationalreview/.test(article.url)
      ) {
        this.setState({ conservativeCount: this.state.conservativeCount + 1 });
      }
    }
  };

  countDownSavedArticles = (article) => {
    const exist = this.state.savedArticles.find((item) => {
      return item.id === article.id;
    });
    if (exist) {
      if (
        /msnbc/.test(article.url) ||
        /huffpost/.test(article.url) ||
        /cnn/.test(article.url)
      ) {
        this.setState({ liberalCount: this.state.liberalCount - 1 });
      }
      if (
        /reuters/.test(article.url) ||
        /npr/.test(article.url) ||
        /bbc/.test(article.url)
      ) {
        this.setState({ neutralCount: this.state.neutralCount - 1 });
      }
      if (
        /foxnews/.test(article.url) ||
        /breitbart/.test(article.url) ||
        /nationalreview/.test(article.url)
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
              render={(props) => {
                return <LoginForm {...props} setUserId={this.fetchData} />;
              }}
            />
            <Route
              path={"/home"}
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
