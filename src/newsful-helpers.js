export const conserv_search_news_api =
         "https://api.currentsapi.services/v1/search?apiKey=U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7&domain=foxnews.com,breitbart.com&keywords=";
export const neutral_search_news_api =
  "https://api.currentsapi.services/v1/search?apiKey=U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7&domain=bbc.com,npr.org&keywords=";

export const liberal_search_news_api =
  "https://api.currentsapi.services/v1/search?apiKey=U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7&domain=msnbc.com,huffpost.com&type=1&keywords=";

export const conserv_popular_news_api =
  "https://api.currentsapi.services/v1/latest-news?apiKey=U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7&domain=foxnews.com,breitbart.com"; 

export const neutral_popular_news_api =
  "https://api.currentsapi.services/v1/latest-news?apiKey=U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7&domain=bbc.com,npr.org"; 
export const liberal_popular_news_api =
  "https://api.currentsapi.services/v1/latest-news?apiKey=U-KpTJ3lU2QW7BjPvER-ArREpL9Le5wHQ-KdFLco52cBbJe7&domain=msnbc.com,huffpost.com&type=1"; 

export function countSavedArticles() {
  this.state.savedArticles.forEach((article) => {
    if (
      /msnbc/.test(article.url) ||
      /huffpost/.test(article.url) ||
      /cnn/.test(article.url)
    ) {
      this.setState((state) => {
        return { liberalCount: state.liberalCount + 1 };
      });
    }
    if (
      /reuters/.test(article.url) ||
      /npr/.test(article.url) ||
      /bbc/.test(article.url)
    ) {
      this.setState((state) => {
        return { neutralCount: state.neutralCount + 1 };
      });
    }
    if (
      /foxnews/.test(article.url) ||
      /breitbart/.test(article.url) ||
      /nationalreview/.test(article.url)
    ) {
      this.setState((state) => {
        return { conservativeCount: state.conservativeCount + 1 };
      });
    }
  });
};

