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

  return (
    <div className='citylist'>
      <h3 className='citylist-title'>Favourites</h3>
      {isLoading ? (
        <div className='loading'>Loading...</div>
      ) : errorMessage ? (
        <div className='error'>{errorMessage}</div>
      ) : favourites.length ? (
        <ul className='citylist-list'>
          {favourites.map((cityData) => (
            <CityListing
              key={cityData.id}
              cityData={cityData}
              removeCity={removeFromFavourites}
            />
          ))}
        </ul>
      ) : (
        <span>You have no favourites to show.</span>
      )}
    </div>
  );
}
