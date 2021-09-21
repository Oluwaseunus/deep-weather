import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import CityService from '../utils/CityService';
import WeatherService from '../api/WeatherService';

async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

function getUrlSlug(cityName: string) {
  return cityName.replaceAll(' ', '-').toLowerCase();
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
      {weatherData.map((cityData) => (
        <Link
          key={cityData.name}
          style={{ display: 'flex' }}
          to={{
            state: { cityData },
            pathname: `/${getUrlSlug(cityData.name)}`,
          }}
        >
          <p style={{ marginRight: '1rem' }}>{cityData.name}</p>
          <p>{cityData.main.temp}&deg;F</p>
          <button onClick={removeCity(cityData.name)}>Remove Item</button>
        </Link>
      ))}
    </>
  );
}
