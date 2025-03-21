import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <h1 className="title">The Morning Paper</h1> {/* Centered title */}
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
