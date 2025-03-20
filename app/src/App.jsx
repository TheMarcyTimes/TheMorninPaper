import { useState } from "react";
import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";

function App() {
  const [showWordGame, setShowWordGame] = useState(false);

  return (
    <div>
      <Weather />
      <button onClick={() => setShowWordGame(!showWordGame)}>
        {showWordGame ? "Show News" : "Play Word Game"}
      </button>

      {showWordGame ? <WordGame /> : <News />}
    </div>
  );
}

export default App;
