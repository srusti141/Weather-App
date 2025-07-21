import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
        condition: data.weather[0].main,
      });
    } catch (error) {
      console.error("API fetch error:", error);
    }
  };

  useEffect(() => {
    search("Bhubaneswar");
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`weather-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="top-bar">
        <input ref={inputRef} type="text" placeholder="Search City" />
        <img src={search_icon} alt="search" onClick={() => search(inputRef.current.value)} />
      </div>

      {weatherData && (
        <div className="weather-card fade-in">
          <div className="date-time">
            <p>{formatDate(dateTime)}</p>
            <p>{formatTime(dateTime)}</p>
          </div>

          <img src={weatherData.icon} alt="weather icon" className="weather-icon" />
          <h1 className="temperature">{weatherData.temperature}°C</h1>
          <h2 className="location">{weatherData.location}</h2>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind" />
              <div>
                <p>{weatherData.windSpeed} m/s</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bottom-toggle">
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default Weather;
