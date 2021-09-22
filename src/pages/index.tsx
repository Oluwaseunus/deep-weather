import { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import CityService from '../utils/CityService';
import WeatherService from '../api/WeatherService';
import CityListing from '../components/CityListing';
import { getUrlSlug, sortWeatherData } from '../utils/functions';

interface HomeProps extends RouteComponentProps {}

async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

function geolocationPostitionErrorCallback({
  message,
}: GeolocationPositionError) {
  alert(message + ', please try again.');
}

export default function Home({ history }: HomeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [favourites, setFavourites] = useState<OWMResponse[]>([]);
  const [weatherData, setWeatherData] = useState<OWMResponse[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const weatherData = await Promise.all(
          CityService.getTopCities().map(getCityData)
        );

        const sortedWeatherData = sortWeatherData(weatherData);
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

  useEffect(() => {
    async function getFavourites() {
      setIsLoading(true);
      const favourites: string[] = JSON.parse(
        localStorage.getItem('favourites') || '[]'
      );
      try {
        const weatherData = await Promise.all(favourites.map(getCityData));
        const sortedWeatherData = sortWeatherData(weatherData);
        setFavourites(sortedWeatherData);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'An unexpected error occurred.'
        );
      } finally {
        setIsLoading(false);
      }
    }
    getFavourites();
  }, []);

  function getCurrentLocation() {
    async function successCallback(position: GeolocationPosition) {
      const { latitude, longitude } = position.coords;

      const cityData = await WeatherService.getWeatherByCoords({
        latitude,
        longitude,
      });

      history.push(`/${getUrlSlug(cityData.name)}`, { cityData });
    }

    navigator.geolocation.getCurrentPosition(
      successCallback,
      geolocationPostitionErrorCallback
    );
  }

  function removeCity(name: string) {
    return function () {
      CityService.removeCity(name);
      setWeatherData((weatherData) =>
        weatherData.filter((cityData) => cityData.name !== name)
      );
    };
  }

  function removeFromFavourites(cityName: string) {
    return function () {
      const filtered = favourites.filter(({ name }) => name !== cityName);
      setFavourites(filtered);
      localStorage.setItem(
        'favourites',
        JSON.stringify(filtered.map(({ name }) => name))
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

      <button onClick={getCurrentLocation} type='button'>
        Get Current Location
      </button>

      <h3>Favourites</h3>
      {favourites.map((cityData) => (
        <CityListing
          key={cityData.id}
          cityData={cityData}
          removeCity={removeFromFavourites}
        />
      ))}

      <h3>Defaults</h3>
      {weatherData.map((cityData) => (
        <CityListing
          key={cityData.id}
          cityData={cityData}
          removeCity={removeCity}
        />
      ))}
    </>
  );
}
