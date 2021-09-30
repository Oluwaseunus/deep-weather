import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import City from '../../pages/city';
import { istanbulData } from '../utils/data';
import WeatherService from '../../api/WeatherService';
import StorageService from '../../utils/StorageService';

const get = jest.spyOn(StorageService, 'get');
const store = jest.spyOn(StorageService, 'store');
const weatherSpy = jest.spyOn(WeatherService, 'getCityWeather');

function renderWithRouter(withData = false) {
  let initialEntries;

  if (withData) {
    initialEntries = [
      { pathname: '/istanbul', state: { cityData: istanbulData } },
    ];
  }

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <City />
    </MemoryRouter>
  );
}

describe('city page', () => {
  beforeEach(() => {
    get.mockClear();
    store.mockClear();
    weatherSpy.mockClear();
  });

  it('renders successfully', () => {
    renderWithRouter(true);
    expect(screen.getByText(/istanbul/i)).toBeInTheDocument();
  });

  it('handles weather errors', async () => {
    get.mockReturnValue([]);
    weatherSpy.mockRejectedValue(new Error());
    renderWithRouter();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/an unexpected error occured/i)
    ).toBeInTheDocument();
  });

  it(`updates the city's favourite state`, async () => {
    get.mockReturnValue([]);
    weatherSpy.mockResolvedValue(istanbulData);
    renderWithRouter();

    await waitFor(() => screen.getByText(/istanbul/i));
    expect(get).toBeCalled();
    userEvent.click(screen.getByRole('button', { name: /add to favourites/i }));
    expect(store).toBeCalledWith('favourites', ['Istanbul']);

    const removeButton = () =>
      screen.getByRole('button', { name: /remove from favourites/i });

    expect(removeButton()).toBeInTheDocument();
    userEvent.click(removeButton());
    expect(get).toBeCalledWith('favourites');
    expect(store).toBeCalledWith('favourites', []);
  });
});
