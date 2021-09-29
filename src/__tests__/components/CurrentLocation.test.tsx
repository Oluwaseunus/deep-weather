import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { istanbulData } from '../utils/data';
import { resolveLocation } from '../../utils/functions';
import CurrentLocation from '../../components/CurrentLocation';

jest.spyOn(window, 'alert');
jest.mock('../../utils/functions', () => ({
  resolveLocation: jest.fn(),
}));

describe('CurrentLocation', () => {
  function getButton() {
    return screen.getByRole('button', {
      name: /get current location/i,
    });
  }

  beforeEach(() => {
    (resolveLocation as jest.Mock).mockClear();
  });

  it('renders successfully', () => {
    render(<CurrentLocation />);
    expect(getButton()).toBeInTheDocument();
  });

  it('alerts the users when the location is unavailable', async () => {
    const rejectedValue = 'location unavailable';
    (resolveLocation as jest.Mock).mockRejectedValue(rejectedValue);
    render(<CurrentLocation />);
    userEvent.click(getButton());
    await expect(resolveLocation).rejects.toMatch(rejectedValue);
    expect(window.alert).toBeCalled();
  });

  it('reroutes the user when the location resolves', async () => {
    (resolveLocation as jest.Mock).mockResolvedValue(istanbulData);
    render(<CurrentLocation />);
    userEvent.click(getButton());
    expect(resolveLocation).toBeCalled();
  });
});
