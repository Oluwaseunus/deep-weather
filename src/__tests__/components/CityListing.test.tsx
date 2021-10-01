import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { istanbulData } from '../utils/data';
import CityListing from '../../components/CityListing';

const removeCity = jest.fn();

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <CityListing cityData={istanbulData} removeCity={removeCity} />
    </MemoryRouter>
  );

describe('CityListing', () => {
  beforeEach(() => {
    removeCity.mockClear();
  });

  it('renders the city Data', () => {
    renderWithRouter();
    expect(screen.getByText(/istanbul/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(String(Math.round(istanbulData.main.temp)), 'ig')
      )
    ).toBeInTheDocument();
  });

  it('calls the removeCity method when the button is clicked', () => {
    renderWithRouter();
    fireEvent.click(screen.getByText(/remove item/i));
    expect(removeCity).toBeCalledTimes(1);
  });
});
