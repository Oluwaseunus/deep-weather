import axios from 'axios';
import { istanbulData } from '../utils/data';
import WeatherService from '../../api/WeatherService';

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WeatherService', () => {
  it('gets the weather for a city', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: istanbulData });
    const istanbul = await WeatherService.getCityWeather('istanbul');

    expect(mockedAxios.get).toHaveBeenCalled();
    expect(istanbulData).toEqual(istanbul);
    expect(localStorage.getItem('istanbul-data')).toEqual(
      JSON.stringify(istanbul)
    );
  });

  it('gets the local weather info when it exists', async () => {
    const istanbul = await WeatherService.getCityWeather('istanbul');
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(istanbulData).toEqual(istanbul);
  });

  it('gets the weather for given coordinates', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: istanbulData });

    const istanbul = await WeatherService.getWeatherByCoords({
      latitude: 1,
      longitude: 2,
    });

    expect(mockedAxios.get).toHaveBeenCalled();
    expect(istanbulData).toEqual(istanbul);
    expect(localStorage.getItem('istanbul-data')).toEqual(
      JSON.stringify(istanbul)
    );
  });
});
