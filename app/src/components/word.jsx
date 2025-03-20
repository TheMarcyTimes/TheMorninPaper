import { useState, useEffect } from "react";
import "./word.css";

const MAX_GUESSES = 5;

const WordGame = () => {
  const [difficulty, setDifficulty] = useState("normal");
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES);

  // Function to get a random word based on the difficulty
  const fetchWord = async (length) => {
    try {
      const response = await fetch(
        `https://api.datamuse.com/words?sp=${"?".repeat(length)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setTargetWord(data[randomIndex].word.toLowerCase());
      }
    } catch (error) {
      console.error("Error fetching the word:", error);
    }
  };

  // Function to start a new game
  const startNewGame = () => {
    setGameStarted(true);
    setGuesses([]);
    setCurrentGuess("");
    setMessage("");
    setGameOver(false);
    setGuessesLeft(MAX_GUESSES);
    const length = difficulty === "easy" ? 4 : difficulty === "normal" ? 5 : 7;
    fetchWord(length);
  };

  // Function to handle difficulty change (only before or after a game)
  const handleDifficultyChange = (e) => {
    if (!gameStarted || gameOver) {
      setDifficulty(e.target.value);
      startNewGame();
    } else {
      setMessage("You can only change difficulty before or after a game.");
    }
  };

  // Handle guess submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentGuess.length === targetWord.length) {
      setGuesses([...guesses, currentGuess]);
      setCurrentGuess("");
      setGuessesLeft(guessesLeft - 1);

      if (currentGuess === targetWord) {
        setGameOver(true);
        setMessage(
          `🎉 Congratulations! You guessed the word in ${
            MAX_GUESSES - guessesLeft + 1
          } tries!`
        );
      } else if (guessesLeft - 1 <= 0) {
        setGameOver(true);
        setMessage(`❌ Game Over! The word was: ${targetWord}`);
      }
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

  return (
    <div className="word-game">
      <h2>Wordle Game</h2>
      <div>
        <label htmlFor="difficulty">Select Difficulty: </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          disabled={gameStarted && !gameOver} // Disable difficulty change mid-game
        >
          <option value="easy">Easy (4 letters)</option>
          <option value="normal">Normal (5 letters)</option>
          <option value="hard">Hard (7 letters)</option>
        </select>
      </div>
      {!gameStarted ? (
        <button onClick={startNewGame}>Start Game</button>
      ) : (
        <>
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
            <h3>Guesses Left: {guessesLeft}</h3>
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
          {gameOver && <button onClick={startNewGame}>Start New Game</button>}
        </>
      )}
    </div>
  );
};

export default WordGame;
