import { useState, useEffect } from 'react';
import './word.css';

const MAX_GUESSES = 5;
const DATAMUSE_API_BASE_URL = 'https://api.datamuse.com/words';

// Overall Game Flow:
// 1. User selects difficulty (optional, defaults to normal).
// 2. User clicks "Start Game" or changes difficulty, which triggers `startNewGame`.
// 3. `startNewGame` fetches a word of appropriate length based on difficulty, resets game state.
// 4. User types a guess into the input field.
// 5. User submits the guess, triggering `handleSubmit`.
// 6. `handleSubmit` validates the guess, checks for win/loss conditions, and updates game state.
// 7. Hints are displayed for each guess.
// 8. Game ends if the word is guessed or `MAX_GUESSES` are exhausted.
// 9. User can start a new game.
const WordGame = () => {
  // State Variables:
  const [difficulty, setDifficulty] = useState('normal'); // Current game difficulty ('easy', 'normal', 'hard')
  const [targetWord, setTargetWord] = useState(''); // The word the user is trying to guess
  const [guesses, setGuesses] = useState([]); // Array of past guesses made by the user
  const [currentGuess, setCurrentGuess] = useState(''); // The current word being typed by the user
  const [message, setMessage] = useState(''); // Feedback messages for the user (e.g., errors, win/loss messages)
  const [gameOver, setGameOver] = useState(false); // Boolean indicating if the current game has ended
  const [gameStarted, setGameStarted] = useState(false); // Boolean indicating if a game is currently in progress
  const [guessesLeft, setGuessesLeft] = useState(MAX_GUESSES); // Number of guesses remaining for the current game

  // Function to get a random word based on the difficulty
  const fetchWord = async (length) => {
    try {
      const response = await fetch(
        `${DATAMUSE_API_BASE_URL}?sp=${'?'.repeat(length)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setTargetWord(data[randomIndex].word.toLowerCase());
      }
    } catch (error) {
      console.error('Error fetching the word:', error);
    }
  };

  // Function to start a new game
  const startNewGame = () => {
    setGameStarted(true);
    setGuesses([]);
    setCurrentGuess('');
    setMessage('');
    setGameOver(false);
    setGuessesLeft(MAX_GUESSES);
    const length = difficulty === 'easy' ? 4 : difficulty === 'normal' ? 5 : 7;
    fetchWord(length);
  };

  // Function to handle difficulty change (only before or after a game)
  const handleDifficultyChange = (e) => {
    if (!gameStarted || gameOver) {
      setDifficulty(e.target.value);
      startNewGame();
    } else {
      setMessage('You can only change difficulty before or after a game.');
    }
  };

  // Helper function to check if the guess is valid (correct length)
  const isValidGuess = (guess) => {
    if (guess.length !== targetWord.length) {
      setMessage(`Guess must be ${targetWord.length} letters!`);
      return false;
    }
    return true;
  };

  // Helper function to process the current guess and update basic game state
  const processGuessStateUpdate = (guess) => {
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    setCurrentGuess(''); // Clear the input field
    const newGuessesLeft = guessesLeft - 1;
    setGuessesLeft(newGuessesLeft);
    return { newGuessesLeft, newGuesses }; // Return updated values needed for further checks
  };

  // Helper function to check for a win condition
  // `allGuesses` parameter removed as it was unused. Win condition depends only on the current guess and target word.
  // Number of tries is derived from `currentGuessesLeft`.
  const checkWinCondition = (guess, currentGuessesLeft) => {
    if (guess === targetWord) {
      setGameOver(true); // Game ends on a win
      // setMessage for win includes the number of tries.
      // Since guessesLeft was already decremented in processGuessStateUpdate,
      // the number of tries is MAX_GUESSES - currentGuessesLeft.
      setMessage(
        `🎉 Congratulations! You guessed the word in ${
          MAX_GUESSES - currentGuessesLeft
        } tries!`
      );
      return true; // Game won
    }
    return false; // Game not won
  };

  // Helper function to check for a loss condition
  const checkLossCondition = (currentGuessesLeft) => {
    if (currentGuessesLeft <= 0) {
      setGameOver(true); // Game ends if no guesses are left
      setMessage(`❌ Game Over! The word was: ${targetWord}`);
      return true; // Game lost
    }
    return false; // Game not lost
  };

  // Handle guess submission
  // This function now orchestrates calls to helper functions for validation, state updates, and win/loss checks.
  const handleSubmit = (e) => {
    e.preventDefault();

    if (gameOver) return; // Don't process if game is already over

    // 1. Validate the guess
    if (!isValidGuess(currentGuess)) {
      return;
    }

    // 2. Process the guess and update core game state (guesses array, guessesLeft)
    // `currentGuess` is used here as it holds the value from the input field.
    const { newGuessesLeft } = processGuessStateUpdate(currentGuess);

    // 3. Check for win condition
    // It's important to use `currentGuess` here, not a state variable that might be stale.
    // `guesses` (the state variable) is not passed as it's not needed for the win check itself.
    if (checkWinCondition(currentGuess, newGuessesLeft)) {
      return; // Stop further checks if game is won
    }

    // 4. Check for loss condition if not won
    // `newGuessesLeft` reflects the state after the current guess has been made.
    checkLossCondition(newGuessesLeft);
  };

  // Function to give hints based on the guess
  const giveHints = (guess) => {
    let hints = [];
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === targetWord[i]) {
        hints.push('🟩'); // Green emoji for correct letter in correct position
      } else if (targetWord.includes(guess[i])) {
        hints.push('🟨'); // Yellow emoji for correct letter but wrong position
      } else {
        hints.push('🟥'); // Red emoji for incorrect letter
      }
    }
    return hints;
  };

  return (
    <div className='word-game'>
      <h2>Wordle Game</h2>
      <div>
        <label htmlFor='difficulty'>Select Difficulty: </label>
        <select
          id='difficulty'
          value={difficulty}
          onChange={handleDifficultyChange}
          disabled={gameStarted && !gameOver} // Disable difficulty change mid-game
        >
          <option value='easy'>Easy (4 letters)</option>
          <option value='normal'>Normal (5 letters)</option>
          <option value='hard'>Hard (7 letters)</option>
        </select>
      </div>
      {!gameStarted ? (
        <button className='start-game-button' onClick={startNewGame}>
          Start Game
        </button>
      ) : (
        <>
          <div>
            <h3>Guess the word: </h3>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
                maxLength={targetWord.length}
                disabled={gameOver}
              />
              <button
                className='submit-guess-button'
                type='submit'
                disabled={gameOver}
              >
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
                  {guess} {giveHints(guess).join(' ')}
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
