import { useState, useEffect } from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

import CityNotes from '../components/CityNotes';
import WeatherService from '../api/WeatherService';
import StorageService from '../utils/StorageService';

interface RouteParams {
  city: string;
}

interface LocationState {
  cityData?: OWMResponse;
}

export interface CityPageProps
  extends RouteComponentProps<
    RouteParams,
    StaticContext,
    LocationState | undefined
  > {}

export default function City({ history, location }: CityPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [erorrMessage, setErrorMessage] = useState('');
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    async function getCityData() {
      try {
        if (!location.state?.cityData) {
          // slicing by 1 to remove the "/" from the pathname
          const cityData = await WeatherService.getCityWeather(
            location.pathname.slice(1).replaceAll('-', ' ')
          );

          history.replace(location.pathname, { cityData });
        }
      } catch (err: any) {
        setErrorMessage(
          err.response.data.message || 'An unexpected error occured.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    getCityData();
  }, [history, location.pathname, location.state?.cityData]);

  useEffect(() => {
    const favourites = StorageService.get<string[]>('favourites') || [];
    const cityIsFavourite = favourites.includes(
      location.state?.cityData?.name || ''
    );

    setIsFavourite(cityIsFavourite);
  }, [location.state?.cityData?.name]);

  function addToFavourites() {
    const favourites = StorageService.get<string[]>('favourites') || [];
    favourites.push(location.state!.cityData!.name);
    StorageService.store('favourites', favourites);
    setIsFavourite(true);
  }

  function removeFromFavourites() {
    const favourites = StorageService.get<string[]>('favourites') || [];
    StorageService.store(
      'favourites',
      favourites.filter((city) => location.state!.cityData!.name !== city)
    );

    setIsFavourite(false);
  }

  const { cityData } = location.state || {};

  if (isLoading) return <span>Loading...</span>;

  return (
    <div>
      <Link to='/'>Go Home</Link>
      {cityData ? (
        <div>
          <p>City Name: {cityData.name}</p>
          <p>Temperature: {cityData.main.temp}&deg;F</p>

          {isFavourite ? (
            <button type='button' onClick={removeFromFavourites}>
              Remove from Favourites
            </button>
          ) : (
            <button onClick={addToFavourites} type='button'>
              Add to Favourites
            </button>
          )}

          <CityNotes />
        </div>
      ) : (
        <div>{erorrMessage}</div>
      )}
    </div>
  );
}
