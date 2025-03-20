import { useEffect, useState } from "react";
import { fetchCoordinates, fetchWeather } from "../adapters/handleFetch";
import "./weather.css";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savedWeather, setSavedWeather] = useState([]);

  useEffect(() => {
    // Load saved weather data from local storage when the component mounts
    const savedData = JSON.parse(localStorage.getItem("savedWeather")) || [];
    setSavedWeather(savedData);
    setCity(""); // Clears search input on load
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const coords = await fetchCoordinates(city);
      const weather = await fetchWeather(coords.lat, coords.lon);
      setWeatherData([{ name: city, ...weather }]);
      setError("");
      setCity(""); // Clear the search input after searching
    } catch (error) {
      setError(error.message);
    }
  };

  const saveWeather = (weather) => {
    if (!savedWeather.some((saved) => saved.name === weather.name)) {
      const updatedWeather = [...savedWeather, weather];
      localStorage.setItem("savedWeather", JSON.stringify(updatedWeather));
      setSavedWeather(updatedWeather);
      setMessage(`${weather.name} saved!`);
      setWeatherData([]); // Clear search results after saving
      setCity(""); // Clear search input
    } else {
      setMessage(`${weather.name} is already saved.`);
    }
  };

  const deleteWeather = (cityName) => {
    const updatedWeather = savedWeather.filter(
      (weather) => weather.name !== cityName
    );
    localStorage.setItem("savedWeather", JSON.stringify(updatedWeather));
    setSavedWeather(updatedWeather);
    setWeatherData((prevData) =>
      prevData.filter((weather) => weather.name !== cityName)
    );
    setMessage(`${cityName} deleted from saved weather.`);
  };

  return (
    <div className="weather-container">
      <h2>Weather Checker</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      {weatherData.length > 0 &&
        weatherData.map((weather, index) => (
          <div key={index} className="weather-card">
            <h3>{weather.name}</h3>
            <p>Temperature: {Math.floor(weather.temperature)}°C</p>
            <p>Wind Speed: {Math.floor(weather.windspeed)} km/h</p>
            <button onClick={() => saveWeather(weather)}>Save</button>
            <button onClick={() => deleteWeather(weather.name)}>Delete</button>
          </div>
        ))}

      <h3>Saved Weather Data</h3>
      <div>
        {savedWeather.length > 0 ? (
          savedWeather.map((weather, index) => (
            <div key={index} className="weather-card">
              <h3>{weather.name}</h3>
              <p>Temperature: {Math.floor(weather.temperature)}°C</p>
              <p>Wind Speed: {Math.floor(weather.windspeed)} km/h</p>
              <button onClick={() => deleteWeather(weather.name)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No saved weather data.</p>
        )}
      </div>
    </div>
  );
};

export default Weather;
