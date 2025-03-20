import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">The Marcy Times</h1>
      <div className="layout-container">
        <div className="left-section">
          <div className="news-container">
            <News />
          </div>
          <div className="word-container">
            <WordGame />
          </div>
        </div>
        <div className="right-section">
          <Weather />
        </div>
      </div>
    </div>
  );
}

export default App;
