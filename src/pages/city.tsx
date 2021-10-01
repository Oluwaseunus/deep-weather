import { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import CityNotes from '../components/CityNotes';
import { capitalize } from '../utils/functions';
import WeatherService from '../api/WeatherService';
import StorageService from '../utils/StorageService';

interface LocationState {
  cityData?: OWMResponse;
}

export default function City() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
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
          err.response?.data?.message || 'An unexpected error occured.'
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

  if (isLoading) return <div className='loading'>Loading...</div>;

  return (
    <div className='city-page'>
      <Link to='/' className='go-home'>
        &larr; Go Home
      </Link>
      {cityData ? (
        <>
          <div className='city-page-header'>
            <div className='citydata-info'>
              <h1 className='citydata-title'>
                {cityData.name}, {cityData.sys.country}
              </h1>
              <p className='citydata-temperature'>
                Temperature: {Math.round(cityData.main.temp)}&deg;F
              </p>
              <p className='citydata-summary'>
                <span className='citydata-feels-like'>
                  Feels like {Math.round(cityData.main.feels_like)}&deg;F.
                </span>
                <span className='citydata-description'>
                  {capitalize(cityData.weather[0].description)}.
                </span>
              </p>
            </div>

            {isFavourite ? (
              <button
                type='button'
                className='danger'
                onClick={removeFromFavourites}
              >
                Remove from Favourites
              </button>
            ) : (
              <button type='button' onClick={addToFavourites}>
                Add to Favourites
              </button>
            )}
          </div>

          <CityNotes />
        </>
      ) : (
        <div className='city-page-error'>{capitalize(errorMessage)}</div>
      )}
    </div>
  );
}
