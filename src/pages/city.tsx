import { useEffect, useState } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';

import WeatherService from '../api/WeatherService';

interface RouteParams {
  city: string;
}

interface LocationState {
  cityData?: OWMResponse;
}

interface CityPageProps
  extends RouteComponentProps<
    RouteParams,
    StaticContext,
    LocationState | undefined
  > {}

export default function City({ history, location }: CityPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [erorrMessage, setErrorMessage] = useState('');

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

  const { cityData } = location.state || {};

  if (isLoading) return <span>Loading...</span>;

  if (!cityData) return <span>{erorrMessage}</span>;

  return (
    <div>
      <p>City Name: {cityData.name}</p>
      <p>Temperature: {cityData.main.temp}&deg;F</p>
    </div>
  );
}
