import StorageService from '../../utils/StorageService';

const getItem = jest.fn();
const setItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: getItem,
    setItem: setItem,
    removeItem: jest.fn(),
  },
});

describe('StorageService', () => {
  beforeEach(() => {
    getItem.mockClear();
    setItem.mockClear();
  });

  it('gets values in localStorage', () => {
    const words = ['hello', 'world'];

    getItem.mockReturnValueOnce(JSON.stringify(words));
    let wordsInStorage = StorageService.get('words');
    expect(words).toEqual(wordsInStorage);

    getItem.mockReturnValueOnce(words);
    wordsInStorage = StorageService.get('words');
    expect(words).toEqual(wordsInStorage);

    expect(getItem).toHaveBeenCalledTimes(2);
  });

  it('stores values in localStorage', () => {
    const values = ['world', 'people', 'country', 'all'];
    StorageService.store('hello', values);
    expect(setItem).toBeCalledWith('hello', JSON.stringify(values));
  });
});
