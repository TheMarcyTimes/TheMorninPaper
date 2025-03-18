import { useEffect, useState } from "react";

const News = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch("https://saurav.tech/NewsAPI/top-headlines/category/general/in.json") // Fetch recent news
      .then((res) => res.json())
      .then((data) => setArticles(data.articles.slice(0, 4))) // Get only 4 most recent articles
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  return (
    <div className="news-container">
      {articles.map((article, index) => (
        <a
          key={index}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-item"
        >
          {article.title}
        </a>
      ))}
    </div>
  );
};

export default News;
