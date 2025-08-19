import { useState } from 'react';
import SearchForm from './components/SearchForm';
import WeatherCard from './components/WeatherCard';
import weatherService from './services/weatherService';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (city) => {
    setLoading(true);
    setError('');
    
    try {
      const weatherData = await weatherService.getCurrentWeather(city);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p>Get current weather conditions for any city</p>
      </header>
      
      <main className="app-main">
        <SearchForm onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}
        
        <WeatherCard weather={weather} />
        
        {!weather && !error && !loading && (
          <div className="welcome-message">
            <p>Enter a city name to get started</p>
          </div>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Built with React + Vite | Deployed with Docker + Kubernetes</p>
      </footer>
    </div>
  );
}

export default App;