import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import MainPage from "../MainPage/MainPage";


class App extends Component {
 

  render() {
    return (
      <div className="App">
        <h1>Newsful</h1>

        <Switch>
          <Route
            exact
            path={"/"}
            render={() => {
              return <MainPage />;
            }}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
