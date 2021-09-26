import { useState, useEffect } from 'react';

import CityListing from './CityListing';
import CityService from '../utils/CityService';
import {
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
      setIsLoading(true);

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
    CityService.removeCity(normalizedName);

    setWeatherData((weatherData) =>
      weatherData.filter((cityData) => cityData.name !== name)
    );
  }

  if (isLoading) return <span>Loading...</span>;

  if (errorMessage) return <span>{errorMessage}</span>;

  if (!weatherData.length) return <span>There are no cities to show.</span>;

  return (
    <div>
      <h3>Defaults</h3>
      {weatherData.map((cityData) => (
        <CityListing
          key={cityData.id}
          cityData={cityData}
          removeCity={removeCity}
        />
      ))}
    </div>
  );
}
