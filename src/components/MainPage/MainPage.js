import React, { Component } from "react";
import SearchBar from "../SearchBar/SearchBar";
import ArticleBar from "../ArticleBar/ArticleBar"


class MainPage extends Component {
 
  seperateArticleBias = (articleData) => {
      //const articleDataObj = Object.create({});
    const conservative = articleData.filter(
      item => { 
            return (
              item.source.id === "breitbart-news" ||
              item.source.id === "fox-news" ||
              item.source.id === "national-review"
            );
        }
    )
    const neutral = articleData.filter((item) => {
      return (
        item.source.id === "abc-news" ||
        item.source.id === "associated-press" ||
        item.source.id === "usa-today"
      );
    });
     const liberal = articleData.filter((item) => {
       return (
         item.source.id === "msnbc" ||
         item.source.id === "the-huffington-post" ||
         item.source.id === "cnn"
       );
     });
     console.log(liberal, "this is liberal")
}


  render() {
      this.seperateArticleBias(this.props.articleData)
    //   console.log(this.props.articleData, "this is props article data")
    return (
      <div className="MainPage">
        <SearchBar />
        <ArticleBar heading={"Liberal"} data={this.conservative}/>
        <ArticleBar heading={"Neutral"} />
        <ArticleBar heading={"Conservative"} />
      </div>
    );
  }
}

export default MainPage;
