import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";
import "./App.css"; // Make sure you have a CSS file for styling

function App() {
  return (
    <div className="app-container">
      <div className="main-content">
        <h1>The Morning Paper</h1>
        <div className="news-container">
          <News />
        </div>
        <WordGame />
        <Weather />
      </div>
    </div>
  );
}

export default App;
