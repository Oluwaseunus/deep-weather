import CityService from '../../utils/CityService';
import { topCities } from '../../utils/constants';

const getItem = jest.fn();
const setItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: getItem,
    setItem: setItem,
    removeItem: jest.fn(),
  },
});

describe('City Service', () => {
  beforeEach(() => {
    getItem.mockClear();
    setItem.mockClear();
  });

  it('gets the top cities when available', () => {
    const topCities = ['Istanbul', 'Turkey'];
    getItem.mockReturnValueOnce(JSON.stringify(topCities));
    expect(CityService.getTopCities()).toEqual(topCities);
  });

  it('gets the default top cities when there are no top cities available', () => {
    const citiesInStorage = CityService.getTopCities();
    expect(citiesInStorage).toEqual(topCities);
    expect(setItem).toBeCalledWith('topCities', JSON.stringify(topCities));
  });

  it('removes a city from the list', () => {
    CityService.removeCity('Istanbul');
    expect(setItem).toBeCalledWith(
      'topCities',
      JSON.stringify(topCities.filter((city) => city !== 'Istanbul'))
    );

    getItem.mockReturnValueOnce(JSON.stringify(['Istanbul', 'Turkey']));
    CityService.removeCity('Turkey');
    expect(setItem).toBeCalledWith('topCities', JSON.stringify(['Istanbul']));
  });
});
