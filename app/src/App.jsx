import React from "react";
import News from "./components/news";
import WordGame from "./components/word";
import Weather from "./components/weather";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="app-container">
      {/* Stylish Navbar */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <Link className="navbar-brand custom-brand" to="/">
            🗞️ The Morning Paper
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/">
                  News
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/wordgame">
                  Word Game
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-link" to="/weather">
                  Weather
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<News />} />
          <Route path="/wordgame" element={<WordGame />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
