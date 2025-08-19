function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weather.city}, {weather.country}</h2>
        <img 
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="weather-icon"
        />
      </div>
      <div className="weather-details">
        <div className="temperature">{weather.temperature}°C</div>
        <div className="description">{weather.description}</div>
        <div className="additional-info">
          <span>Humidity: {weather.humidity}%</span>
          <span>Wind: {weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;