import { useEffect, useState } from "react";
import config from '../config';

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!config.OPENWEATHER_API_KEY) {
        setError("OpenWeather API key not configured");
        setLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setError("Geolocation not supported in this browser.");
        setLoading(false);
        return;
      }

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        console.log("📍 User Location:", latitude, longitude);

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${config.OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Weather API:", data);
        
        setWeather({
          city: data.name,
          temp: data.main.temp,
          wind: data.wind.speed,
          pressure: data.main.pressure,
          desc: data.weather[0].description,
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err.message || "Error fetching weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p className="text-blue-500">Loading weather...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!weather) return <p className="text-gray-500">No weather data available</p>;

  return (
    <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded-lg shadow text-center">
      <h3 className="text-lg font-bold">🌦 Current Weather</h3>
      <p className="mt-2 font-semibold">{weather.city}</p>
      <p className="mt-1 capitalize">{weather.desc}</p>
      <p className="mt-1">🌡 Temp: {weather.temp}°C</p>
      <p className="mt-1">💨 Wind: {weather.wind} m/s</p>
      <p className="mt-1">🔽 Pressure: {weather.pressure} hPa</p>
    </div>
  );
}

export default WeatherCard;
