import { useState, useEffect } from 'react';

import CityListing from './CityListing';
import CityService from '../utils/CityService';
import {
  capitalize,
  getCityData,
  normalizeString,
  sortWeatherData,
} from '../utils/functions';

export default function TopCities() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [weatherData, setWeatherData] = useState<OWMResponse[]>([]);

  useEffect(() => {
    async function fetchTopCities() {
      try {
        const weatherData = await Promise.all(
          CityService.getTopCities().map(getCityData)
        );

        const sortedWeatherData = sortWeatherData(weatherData);
        setWeatherData(sortedWeatherData);
      } catch (err: any) {
        setErrorMessage(err.message || 'An unexpected error occurred.');
        return [];
      } finally {
        setIsLoading(false);
      }
    }

    fetchTopCities();
  }, []);

  function removeCity(name: string) {
    const normalizedName = normalizeString(name);
    CityService.removeFromTopCities(normalizedName);

    setWeatherData((weatherData) =>
      weatherData.filter((cityData) => cityData.name !== name)
    );
  }

  return (
    <div className='citylist'>
      <h3 className='citylist-title'>Defaults</h3>
      {isLoading ? (
        <div className='loading'>Loading...</div>
      ) : errorMessage ? (
        <div className='error'>{capitalize(errorMessage)}</div>
      ) : weatherData.length ? (
        <ul className='citylist-list'>
          {weatherData.map((cityData) => (
            <CityListing
              key={cityData.id}
              cityData={cityData}
              removeCity={removeCity}
            />
          ))}
        </ul>
      ) : (
        <p>Hidden all defaults.</p>
      )}
    </div>
  );
}
