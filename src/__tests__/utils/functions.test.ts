import axios from 'axios';
import * as functions from '../../utils/functions';
import { istanbulData, shangHaiData } from './data';

const getCurrentPosition = jest.fn();
const mockedAxios = axios as jest.Mocked<typeof axios>;

(window.navigator as any).geolocation = {
  getCurrentPosition: getCurrentPosition,
};

describe('functions', () => {
  test('getCityData', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: shangHaiData });
    const shanghai = await functions.getCityData('shanghai');
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(shangHaiData).toEqual(shanghai);
  });

  test('getUrlSlug', () => {
    expect(functions.getUrlSlug('HeLlO wOrLd')).toEqual('hello-world');
  });

  test('normalizeString', () => {
    expect(functions.normalizeString('São Paulo')).toEqual('Sao Paulo');
  });

  test('sortWeatherData', () => {
    let data = [shangHaiData, istanbulData];
    expect(functions.sortWeatherData(data)).toEqual([
      istanbulData,
      shangHaiData,
    ]);

    data = [istanbulData, shangHaiData];
    expect(functions.sortWeatherData(data)).toEqual([
      istanbulData,
      shangHaiData,
    ]);
  });
});

describe('resolveLocation', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('rejects improper payload', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: {} });
    getCurrentPosition.mockImplementationOnce((success) => {
      success({ coords: { latitude: 1, longitude: 2 } });
    });

    await expect(functions.resolveLocation()).rejects.toBe(
      'Failed to get a city from your location.'
    );
  });

  it('rejects geolocation error', async () => {
    const message = 'geolocation is not available';
    getCurrentPosition.mockImplementationOnce((success, error) => {
      error(new Error(message));
    });

    await expect(functions.resolveLocation()).rejects.toBe(message);
  });

  it('rejects axios error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('failed to fetch'));
    getCurrentPosition.mockImplementationOnce((success) => {
      success({ coords: { latitude: 1, longitude: 2 } });
    });

    await expect(functions.resolveLocation()).rejects.toBe('failed to fetch');
    expect(mockedAxios.get).toBeCalled();
  });

  it('resolves successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: istanbulData });
    getCurrentPosition.mockImplementationOnce((success) => {
      success({ coords: { latitude: 1, longitude: 2 } });
    });

    await expect(functions.resolveLocation()).resolves.toBe(istanbulData);
  });
});
