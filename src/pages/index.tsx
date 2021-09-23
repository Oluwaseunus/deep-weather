import { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { getUrlSlug } from '../utils/functions';
import TopCities from '../components/TopCities';
import WeatherService from '../api/WeatherService';
import FavouriteCities from '../components/FavouriteCities';

interface HomeProps extends RouteComponentProps {}

function geolocationPostitionErrorCallback({
  message,
}: GeolocationPositionError) {
  alert(message + ', please try again.');
}

export default function Home({ history }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

      <FavouriteCities />
      <TopCities />
    </>
  );
}
