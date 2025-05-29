import { useEffect, useState } from 'react';
import { fetchCoordinates, fetchWeather } from '../adapters/handleFetch';
import './weather.css';

const SAVED_WEATHER_LOCAL_STORAGE_KEY = 'savedWeather';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [savedWeather, setSavedWeather] = useState([]);

  // Effect hook to load saved weather data from local storage when the component initially mounts.
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(SAVED_WEATHER_LOCAL_STORAGE_KEY)) || [];
    setSavedWeather(savedData);
    setCity(''); // Clear search input field on initial load
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const coords = await fetchCoordinates(city);
      const weather = await fetchWeather(coords.lat, coords.lon);
      // Display the fetched weather data for the searched city
      setWeatherData([{ name: city, ...weather }]);
      setError(''); // Clear any previous errors
      setCity(''); // Clear the search input field after a successful search
    } catch (error) {
      setError(error.message); // Display error message if fetching fails
      setWeatherData([]); // Clear any previous weather data on error
    }
  };

  // Saves a weather entry to local storage and updates the UI.
  const saveWeather = (weather) => {
    // Check if the city is already saved to prevent duplicates
    if (!savedWeather.some((saved) => saved.name === weather.name)) {
      const updatedWeather = [...savedWeather, weather];
      localStorage.setItem(SAVED_WEATHER_LOCAL_STORAGE_KEY, JSON.stringify(updatedWeather));
      setSavedWeather(updatedWeather);
      setMessage(`${weather.name} saved!`);
      setWeatherData([]); // Clear current search results from display after saving
      setCity(''); // Clear search input field
    } else {
      setMessage(`${weather.name} is already saved.`);
    }
  };

  // Deletes a weather entry from local storage and updates the UI.
  const deleteWeather = (cityName) => {
    const updatedWeather = savedWeather.filter(
      (weather) => weather.name !== cityName
    );
    localStorage.setItem(SAVED_WEATHER_LOCAL_STORAGE_KEY, JSON.stringify(updatedWeather));
    setSavedWeather(updatedWeather);
    // Also remove from the currently displayed weatherData if it's the one being deleted
    setWeatherData((prevData) =>
      prevData.filter((weather) => weather.name !== cityName)
    );
    setMessage(`${cityName} deleted from saved weather.`);
  };

  return (
    <div className='weather-container'>
      {/* Decorative clouds element */}
      <div className='clouds'></div>
      <h2>Weather Checker</h2>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          placeholder='Enter city name'
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type='submit'>Get Weather</button>
      </form>
      {error && <p className='error'>{error}</p>}
      {message && <p className='message'>{message}</p>}

      {/* Display current search results */}
      {weatherData.length > 0 &&
        weatherData.map((weather, index) => (
          <div key={index} className='weather-card'>
            <h3>{weather.name}</h3>
            <p>Temperature: {Math.floor(weather.temperature)}°C</p>
            <p>Wind Speed: {Math.floor(weather.windspeed)} km/h</p>
            <button onClick={() => saveWeather(weather)}>Save</button>
            <button onClick={() => deleteWeather(weather.name)}>Delete</button> {/* Assuming delete can also apply to searched, unsaved items if they match a name */}
          </div>
        ))}

      {/* Display saved weather cards */}
      <h3>Saved Weather Data</h3>
      <div>
        {savedWeather.length > 0 ? (
          savedWeather.map((weather, index) => (
            <div key={index} className='weather-card'>
              <h3>{weather.name}</h3>
              <p className='temperature'>
                Temperature: {Math.floor(weather.temperature)}°C
              </p>
              <p className='wind-speed'>
                Wind Speed: {Math.floor(weather.windspeed)} km/h
              </p>

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
