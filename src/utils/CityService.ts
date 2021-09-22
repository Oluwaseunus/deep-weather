import { topCities } from './constants';
import StorageService from './StorageService';

export default class CityService {
  static getTopCities(): string[] {
    const localCities = StorageService.get<string[]>('topCities');

    if (localCities) {
      return localCities;
    } else {
      StorageService.store('topCities', topCities);
      return topCities;
    }
  }

  static removeCity(cityName: string) {
    const localCities = StorageService.get<string[]>('topCities');
    const cityNames = localCities || topCities;
    const updatedCities = cityNames.filter((name) => name !== cityName);
    StorageService.store('topCities', updatedCities);
  }
}
