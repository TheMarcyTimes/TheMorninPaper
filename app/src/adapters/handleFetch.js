// handleFetch.js

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com';

const NOMINATIM_SEARCH_PATH = '/search';
const OPEN_METEO_FORECAST_PATH = '/v1/forecast';

/**
 * Fetches geographic coordinates (latitude and longitude) for a given city name
 * using the Nominatim API.
 * @param {string} cityName - The name of the city to search for.
 * @returns {Promise<object>} A promise that resolves to an object containing lat and lon.
 * @throws {Error} If the city is not found or if there's an error during the fetch.
 */
export const fetchCoordinates = async (cityName) => {
  try {
    const res = await fetch(
      `${NOMINATIM_BASE_URL}${NOMINATIM_SEARCH_PATH}?q=${encodeURIComponent(
        cityName
      )}&format=json`
    );
    const data = await res.json();

    if (data.length === 0) {
      throw new Error('City not found. Please try again.');
    }

    return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
    // Log the original error for debugging purposes if needed.
    console.error('Coordinate fetch error:', error.message); // Log the actual error message
    throw new Error('Error fetching coordinates.'); // Throw a generic error to the user
  }
};

/**
 * Fetches current weather data for given latitude and longitude using the Open-Meteo API.
 * @param {number|string} lat - The latitude.
 * @param {number|string} lon - The longitude.
 * @returns {Promise<object>} A promise that resolves to the current weather data object.
 * @throws {Error} If there's an error during the fetch.
 */
export const fetchWeather = async (lat, lon) => {
  try {
    const res = await fetch(
      `${OPEN_METEO_BASE_URL}${OPEN_METEO_FORECAST_PATH}?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await res.json();
    return data.current_weather;
  } catch (error) {
    console.error('Weather fetch error:', error.message);
    throw new Error('Error fetching weather data.');
  }
};

/**
 * Fetches current weather data for a list of cities.
 * Each city object in the input array should have `lat` and `lon` properties.
 * @param {Array<object>} cities - An array of city objects, each with lat and lon.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of city objects,
 *                                   each augmented with current_weather data.
 * @throws {Error} If there's an error during any of the fetches.
 */
export const fetchWeatherForCities = async (cities) => {
  try {
    const requests = cities.map(async (city) => {
      const res = await fetch(
        `${OPEN_METEO_BASE_URL}${OPEN_METEO_FORECAST_PATH}?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
      );
      const data = await res.json();
      return { ...city, ...data.current_weather };
    });

    return await Promise.all(requests);
  } catch (error) {
    console.error('Default weather fetch error:', error.message);
    throw new Error('Error fetching default weather data.');
  }
};
