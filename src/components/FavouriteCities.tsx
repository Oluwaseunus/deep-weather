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

      try {
        const favourites = StorageService.get<string[]>('favourites') || [];
        const weatherData = await Promise.all(favourites.map(getCityData));
        const sortedWeatherData = sortWeatherData(weatherData);
        setFavourites(sortedWeatherData);
      } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    getFavourites();
  }, []);

  function removeFromFavourites(cityName: string) {
    const filtered = favourites.filter(({ name }) => name !== cityName);
    setFavourites(filtered);
    const filteredNames = filtered.map(({ name }) => name);
    StorageService.store('favourites', filteredNames);
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
