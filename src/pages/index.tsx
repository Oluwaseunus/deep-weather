import { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import CityService from '../utils/CityService';
import WeatherService from '../api/WeatherService';

interface HomeProps extends RouteComponentProps {}

async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

function getUrlSlug(cityName: string) {
  return cityName.replaceAll(' ', '-').toLowerCase();
}

export default function Home({ history }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
      <form
        className='search-input__wrapper'
        onSubmit={() => history.push(`/${getUrlSlug(searchQuery)}`)}
      >
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>

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
