import React, { Component } from "react";
import Article from "../Article/Article"

class ArticleBar extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //     articleData: props.articleData,
    // }
  }

  render() {
    return (
      <div className="ArticleBar">
        <h2>{this.props.heading}</h2>
        <Article />
      </div>
    );
  }
}

export default ArticleBar;
