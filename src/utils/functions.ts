import WeatherService from '../api/WeatherService';

export async function getCityData(cityName: string) {
  return await WeatherService.getCityWeather(cityName);
}

export function getUrlSlug(cityName: string) {
  return cityName.replaceAll(' ', '-').toLowerCase();
}

export function normalizeString(string: string) {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function sortWeatherData(data: OWMResponse[]) {
  return [...data].sort((a, b) => (a.name > b.name ? 1 : -1));
}

export function resolveLocation(): Promise<OWMResponse> {
  return new Promise((resolve, reject) => {
    async function successCallback({ coords }: GeolocationPosition) {
      const { latitude, longitude } = coords;

      try {
        const cityData = await WeatherService.getWeatherByCoords({
          latitude,
          longitude,
        });

        if (cityData?.name) {
          resolve(cityData);
        } else {
          reject(`Failed to get a city from your location.`);
        }
      } catch (err: any) {
        reject(err.message);
      }
    }

    navigator.geolocation.getCurrentPosition(successCallback, ({ message }) => {
      reject(message);
    });
  });
}
