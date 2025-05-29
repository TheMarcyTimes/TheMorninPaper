import React, { useState, useEffect } from 'react';
import News from './components/news';
import WordGame from './components/word';
import Weather from './components/weather';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Link } from 'react-router-dom';

const DARK_MODE_CLASS = 'dark';
const LIGHT_MODE_CLASS = 'light';
const SWITCH_TO_LIGHT_MODE_TEXT = 'Switch to Light Mode';
const SWITCH_TO_DARK_MODE_TEXT = 'Switch to Dark Mode';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false); // state for dark mode

  // Toggle the theme
  const toggleTheme = () => {
    setIsDarkMode((prevState) => !prevState);
  };

  // Effect hook to apply the selected theme (dark/light) to the body element.
  // This runs whenever the `isDarkMode` state changes.
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add(DARK_MODE_CLASS);
      document.body.classList.remove(LIGHT_MODE_CLASS);
    } else {
      document.body.classList.add(LIGHT_MODE_CLASS);
      document.body.classList.remove(DARK_MODE_CLASS);
    }
  }, [isDarkMode]);

  return (
    <div className='app-container'>
      {/* Application Navigation Bar */}
      <nav className='navbar navbar-expand-lg custom-navbar'>
        <div className='container-fluid'>
          <Link className='navbar-brand custom-brand' to='/'>
            🗞️ The Morning Paper
          </Link>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav ms-auto'>
              <li className='nav-item'>
                <Link className='nav-link custom-link' to='/weather'>
                  Weather
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link custom-link' to='/'>
                  News
                </Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link custom-link' to='/wordgame'>
                  Word Game
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Theme Toggle Button */}
      <button className='theme-toggle-btn' onClick={toggleTheme}>
        {isDarkMode ? SWITCH_TO_LIGHT_MODE_TEXT : SWITCH_TO_DARK_MODE_TEXT}
      </button>

      {/* Main Content Area for Routed Components */}
      <div className='container mt-4'>
        <Routes>
          <Route path='/' element={<News />} />
          <Route path='/wordgame' element={<WordGame />} />
          <Route path='/weather' element={<Weather />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
