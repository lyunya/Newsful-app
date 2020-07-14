import React, { Component } from "react";


class Article extends Component {
    constructor(props){
        super(props)
        // this.state = {
        //     articleData: props.articleData,
        // }
    }
  

  render() {
    return (
      <div className="Article">
          <img alt={`article image`} src={this} />
      </div>
    );
  }
}

export default Article;
