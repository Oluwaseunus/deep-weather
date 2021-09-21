import { useEffect, useState } from 'react';
import CityService from '../utils/CityService';
import WeatherService from '../api/WeatherService';

async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [weatherData, setWeatherData] = useState<OWMResponse[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const weatherData = await Promise.all(
          CityService.getTopCities().map(getCityData)
        );

        const sortedWeatherData = weatherData.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        setWeatherData(sortedWeatherData);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'An unexpected error occurred.'
        );
        return [];
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  function removeCity(name: string) {
    return function () {
      CityService.removeCity(name);
      setWeatherData((weatherData) =>
        weatherData.filter((cityData) => cityData.name !== name)
      );
    };
  }

  if (isLoading) return <span>Loading...</span>;

  if (errorMessage) return <span>{errorMessage}</span>;

  if (!weatherData.length) return <span>Response is empty.</span>;

  return (
    <>
      {weatherData.map(({ name, main }) => (
        <div key={name} style={{ display: 'flex' }}>
          <p style={{ marginRight: '1rem' }}>{name}</p>
          <p>{main.temp}&#8457;</p>
          <button onClick={removeCity(name)}>Remove Item</button>
        </div>
      ))}
    </>
  );
}
