import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { istanbulData } from '../../utils/__tests/data';
import FavouriteCities from '../../components/FavouriteCities';

const history = createMemoryHistory();
function renderWithRouter() {
  return render(
    <Router history={history}>
      <FavouriteCities />
    </Router>
  );
}

const getItem = jest.fn();
const setItem = jest.fn();

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: getItem,
    setItem: setItem,
    removeItem: jest.fn(),
  },
});

describe('FavouriteCities', () => {
  beforeEach(() => {
    getItem.mockClear();
  });

  it('renders the empty and loading states', async () => {
    render(<FavouriteCities />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', {
        name: /favourites/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/you have no favourites to show/i)
    ).toBeInTheDocument();
  });

  it('removes cities from the list', async () => {
    getItem
      .mockReturnValueOnce(JSON.stringify(['Istanbul']))
      .mockReturnValueOnce(JSON.stringify(istanbulData))
      .mockReturnValueOnce(JSON.stringify(['Istanbul']));

    renderWithRouter();

    expect(await screen.findByText(/favourites/i)).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Remove Item' }));

    expect(
      screen.getByText(/you have no favourites to show/i)
    ).toBeInTheDocument();
    expect(setItem).toBeCalledWith('favourites', JSON.stringify([]));
  });

  it('renders the provided error message', async () => {
    getItem.mockImplementationOnce(() => {
      throw new Error('not found');
    });

    renderWithRouter();

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it('renders the default error message', async () => {
    getItem.mockImplementationOnce(() => {
      throw new Error();
    });

    renderWithRouter();

    expect(
      await screen.findByText(/an unexpected error occurred/i)
    ).toBeInTheDocument();
  });
});
