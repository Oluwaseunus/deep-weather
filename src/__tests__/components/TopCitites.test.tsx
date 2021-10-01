import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { istanbulData } from '../utils/data';
import TopCities from '../../components/TopCities';

const history = createMemoryHistory();
function renderWithRouter() {
  return render(
    <Router history={history}>
      <TopCities />
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

describe('TopCities', () => {
  beforeEach(() => {
    getItem.mockClear();
  });

  it('mounts in the loading state', async () => {
    getItem
      .mockReturnValueOnce(JSON.stringify(['istanbul']))
      .mockReturnValueOnce(JSON.stringify(istanbulData));
    renderWithRouter();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/defaults/i)).toBeInTheDocument();

    expect(screen.getByText(/istanbul/i)).toBeInTheDocument();
  });

  it('removes cities from the list', async () => {
    getItem
      .mockReturnValueOnce(JSON.stringify(['Istanbul']))
      .mockReturnValueOnce(JSON.stringify(istanbulData))
      .mockReturnValueOnce(JSON.stringify(['Istanbul']));
    renderWithRouter();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/defaults/i)).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Remove Item' }));

    expect(screen.getByText(/hidden all defaults/i)).toBeInTheDocument();
    expect(setItem).toBeCalledWith('topCities', JSON.stringify([]));
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
