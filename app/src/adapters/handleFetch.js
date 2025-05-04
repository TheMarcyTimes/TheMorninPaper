// handleFetch.js

export const fetchCoordinates = async (cityName) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        cityName
      )}&format=json`
    );
    const data = await res.json();

    if (data.length === 0) {
      throw new Error("City not found. Please try again.");
    }

    return { lat: data[0].lat, lon: data[0].lon };
  } catch (error) {
    throw new Error("Error fetching coordinates.");
  }
};

export const fetchWeather = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await res.json();
    return data.current_weather;
  } catch (error) {
    throw new Error("Error fetching weather data.");
  }
};

export const fetchWeatherForCities = async (cities) => {
  try {
    const requests = cities.map(async (city) => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
      );
      const data = await res.json();
      return { ...city, ...data.current_weather };
    });

    return await Promise.all(requests);
  } catch (error) {
    throw new Error("Error fetching default weather data.");
  }
};
