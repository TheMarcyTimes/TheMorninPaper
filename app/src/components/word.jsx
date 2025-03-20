import { useState, useEffect } from "react";
import "./word.css";

const WordGame = () => {
  const [difficulty, setDifficulty] = useState("normal");
  const [targetWord, setTargetWord] = useState(""); // Target word for guessing
  const [guesses, setGuesses] = useState([]); // List of guesses
  const [currentGuess, setCurrentGuess] = useState(""); // Current guess input
  const [message, setMessage] = useState(""); // Message to show user
  const [gameOver, setGameOver] = useState(false); // Game over flag

  // Function to get a random word based on the difficulty
  const fetchWord = async (length) => {
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${"?".repeat(length)}`
      );
      const data = await response.json();
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomWord = data[randomIndex].word.toLowerCase(); // Pick a random word
      setTargetWord(randomWord); // Update target word
    } catch (error) {
      console.error("Error fetching the word:", error);
    }
  };

  // Start a new game by fetching a word based on the difficulty
  useEffect(() => {
    switch (difficulty) {
      case "easy":
        fetchWord(4); // Easy: 4-letter word
        break;
      case "normal":
        fetchWord(5); // Normal: 5-letter word
        break;
      case "hard":
        fetchWord(7); // Hard: 7-letter word
        break;
      default:
        fetchWord(5); // Default to normal difficulty if no valid difficulty
        break;
    }
  }, [difficulty]);

  // Handle guess submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentGuess.length === targetWord.length) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");
    } else {
      setMessage(`Guess must be ${targetWord.length} letters!`);
    }
  };

  // Function to give hints based on the guess
  const giveHints = (guess) => {
    let hints = [];
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        hints.push("🟩"); // Green emoji for correct letter in correct position
      } else if (targetWord.includes(guess[i])) {
        hints.push("🟨"); // Yellow emoji for correct letter but wrong position
      } else {
        hints.push("🟥"); // Red emoji for incorrect letter
      }
    }
    return hints;
  };

  // Function to reset the game
  const resetGame = () => {
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setGameOver(false);
    fetchWord(difficulty === "easy" ? 4 : difficulty === "normal" ? 5 : 7);
  };

  return (
    <div className="word-game">
      <h2>Wordle Game</h2>
      <div>
        <label htmlFor="difficulty">Select Difficulty: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy (4 letters)</option>
          <option value="normal">Normal (5 letters)</option>
          <option value="hard">Hard (7 letters)</option>
        </select>
      </div>
      <div>
        <h3>Guess the word: </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
            maxLength={targetWord.length}
            disabled={gameOver}
          />
          <button type="submit" disabled={gameOver}>
            Submit Guess
          </button>
        </form>
      </div>
      <div>
        <h3>Previous Guesses:</h3>
        <ul>
          {guesses.map((guess, index) => (
            <li key={index}>
              {guess} {giveHints(guess).join(" ")}
            </li>
          ))}
        </ul>
      </div>
      {message && <p>{message}</p>}
      {gameOver && <p>Game Over! The word was: {targetWord}</p>}
      <button onClick={resetGame}>Start New Game</button>
    </div>
  );
};

export default WordGame;
