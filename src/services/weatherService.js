import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

class WeatherService {
  async getCurrentWeather(city) {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      return {
        city: response.data.name,
        country: response.data.sys.country,
        temperature: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
        icon: response.data.weather[0].icon
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }

  async getHealthCheck() {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
}

export default new WeatherService();