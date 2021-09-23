import WeatherService from '../api/WeatherService';

export async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

export function getUrlSlug(cityName: string) {
  return cityName.replaceAll(' ', '-').toLowerCase();
}

export function sortWeatherData(data: OWMResponse[]) {
  return [...data].sort((a, b) => (a.name > b.name ? 1 : -1));
}
