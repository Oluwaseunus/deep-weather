import { useQuery } from 'react-query';
import { topCities } from '../utils/constants';
import WeatherService from '../api/WeatherService';

async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

export default function Home() {
  const { isLoading, error, data } = useQuery('homeCities', async () => {
    const weatherData = await Promise.all(topCities.map(getCityData));
    return weatherData.sort((a, b) => (a.name > b.name ? 1 : -1));
  });

  if (isLoading) return <span>Loading...</span>;

  if (error)
    return <span>An error has occured: {(error as Error).message}</span>;

  if (!data?.length) return <span>Response is empty.</span>;

  return (
    <>
      {data.map((cityData) => (
        <div key={cityData.name}>
          <p>{cityData.name}</p>
          <p>{cityData.main.temp}C</p>
        </div>
      ))}
    </>
  );
}
