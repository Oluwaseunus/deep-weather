import axios from 'axios';
import * as functions from '../functions';
import { istanbulData, shangHaiData } from './data';

const mockedAxios = axios as jest.Mocked<typeof axios>;

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
    const data = [shangHaiData, istanbulData];
    expect(functions.sortWeatherData(data)).toEqual([
      istanbulData,
      shangHaiData,
    ]);
  });
});
