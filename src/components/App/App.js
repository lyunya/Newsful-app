import React, { Component } from "react";
import SearchBar from '../SearchBar/SearchBar'


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      articleData: []
    }
  }

    setPopularArticles(){
        const breakingNews = `https://newsapi.org/v2/top-headlines?country=us&apiKey=fcea81b72a8041cb91c36892e482ab0d`;
        fetch(breakingNews)
            .then((res) => 
            !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
            )
            .then((responseJson) => {
                let articleData = responseJson.articles.map((item) => item)
                this.setState({
                  articleData,
                })
                console.log(articleData, "this is article data")
            })
    }

    render() {
    return (
      <div className="App">
        <h1>Newsful</h1>
        <SearchBar />
        <button onClick={this.setPopularArticles}>Popular</button>
      </div>
    );
  }
}

export default App;
