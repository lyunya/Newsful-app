import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { popular_news } from "../../newsful-helpers";
import MainPage from "../MainPage/MainPage";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleData: [],
    };
  }
  setPopularArticles = () => {
    fetch(popular_news)
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((responseJson) => {
        const articleData = responseJson.articles.map((item) => item);
        this.setState({
          articleData: articleData,
        });
      });
  };
  componentDidMount() {
    this.setPopularArticles();
  }

  render() {
    return (
      <div className="App">
        <h1>Newsful</h1>

        <Switch>
          <Route
            exact
            path={"/"}
            render={() => {
              return <MainPage articleData={this.state.articleData} />;
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
