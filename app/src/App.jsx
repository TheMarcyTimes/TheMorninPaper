import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";
import "./App.css"; // Make sure you have a CSS file for styling

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <Weather />
        <WordGame />
      </div>
      <div className="news-container">
        <News />
      </div>
    </div>
  );
}

export default App;
