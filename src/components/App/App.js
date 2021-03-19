import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBookmark as fasBookmark,
  faSearch as fasSearch,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import './App.css';
import MainPage from '../MainPage/MainPage';
import LoginForm from '../LoginForm/LoginForm';
import RegistrationForm from '../RegistrationForm/RegistrationForm';
import SavedArticles from '../SavedArticles/SavedArticles';
import TokenService from '../../services/token-service';
import Config from '../../config';

const API = Config.API_ENDPOINT;
library.add(fasBookmark, farBookmark, fasSearch);

export const NewsfulContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedArticles: [],
      saveArticle: this.saveArticle,
      deleteSave: this.deleteSave,
      user_id: this.user_id,
      error: null,
      darkMode: false,
      toggleDarkMode: this.toggleDarkMode,
    };
  }

  componentDidMount() {
    this.getMode();
    const token = TokenService.hasAuthToken();
    if (token) {
      this.fetchData(localStorage.getItem('userId'));
    }
  }

  fetchData = (user_id) => {
    this.setState({
      user_id: parseInt(user_id),
    });
    fetch(`${API}/saved-articles`)
      .then((articlesRes) => articlesRes.json())
      .then((savedArticles) => {
        this.setState({
          savedArticles: savedArticles.filter(
            (article) => article.user_id.toString() === user_id.toString()
          ),
        });
      })
      .catch((res) => {
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
      (item) => item.url !== article.url
    );
    this.setState({ savedArticles: newSavedArticles });
  };

  getMode = () => {
    const savedMode = JSON.parse(localStorage.getItem('dark'));
    this.setState({ darkMode: savedMode || false });
  };

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode });
    const currMode = this.state.darkMode.toString();
    localStorage.setItem('dark', currMode);
  };

  render() {
    return (
      <div className={this.state.darkMode ? 'app-dark-mode' : 'app'}>
        <NewsfulContext.Provider value={this.state}>
          <Switch>
            <Route
              exact
              path='/'
              render={(props) => (
                <LoginForm {...props} setUserId={this.fetchData} />
              )}
            />
            <Route path='/registration' component={RegistrationForm} />
            <Route path='/home' component={MainPage} />
            <Route path='/saved-articles' component={SavedArticles} />
          </Switch>
        </NewsfulContext.Provider>
      </div>
    );
  }
}

export default App;
