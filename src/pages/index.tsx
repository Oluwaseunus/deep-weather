import { RouteComponentProps } from 'react-router-dom';

import { getUrlSlug } from '../utils/functions';
import TopCities from '../components/TopCities';
import WeatherService from '../api/WeatherService';
import LocationSearch from '../components/LocationSearch';
import FavouriteCities from '../components/FavouriteCities';

interface HomeProps extends RouteComponentProps {}

function geolocationPostitionErrorCallback({
  message,
}: GeolocationPositionError) {
  alert(message + ', please try again.');
}

export default function Home({ history }: HomeProps) {
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
      <LocationSearch />

      <button onClick={getCurrentLocation} type='button'>
        Get Current Location
      </button>

      <FavouriteCities />
      <TopCities />
    </>
  );
}
