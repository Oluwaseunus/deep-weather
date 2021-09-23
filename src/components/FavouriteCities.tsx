import { useState, useEffect } from 'react';

import CityListing from './CityListing';
import StorageService from '../utils/StorageService';
import { getCityData, sortWeatherData } from '../utils/functions';

export default function FavouriteCities() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [favourites, setFavourites] = useState<OWMResponse[]>([]);

  useEffect(() => {
    async function getFavourites() {
      setIsLoading(true);
      const favourites = StorageService.get<string[]>('favourites') || [];

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

  function removeFromFavourites(cityName: string) {
    return function () {
      const filtered = favourites.filter(({ name }) => name !== cityName);
      setFavourites(filtered);
      StorageService.store(
        'favourites',
        filtered.map(({ name }) => name)
      );
    };
  }

  if (isLoading) return <span>Loading...</span>;

  if (errorMessage) return <span>{errorMessage}</span>;

  return (
    <div>
      <h3>Favourites</h3>
      {favourites.length ? (
        favourites.map((cityData) => (
          <CityListing
            key={cityData.id}
            cityData={cityData}
            removeCity={removeFromFavourites}
          />
        ))
      ) : (
        <span>You have no favourites to show.</span>
      )}
    </div>
  );
}
