import React, { useState, useEffect } from "react";
import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle the theme
  const toggleTheme = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  // Apply the theme to the body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className={`app-container ${isDarkMode ? "dark" : "light"}`}>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <h1 className="title">The Morning Paper</h1>
      <div className="content-wrapper">
        <div className="news-wrapper">
          <News />
        </div>
        <div className="word-wrapper">
          <WordGame />
        </div>
        <div className="weather-wrapper">
          <Weather />
        </div>
      </div>
    </div>
  );
}

export default App;
