import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import LocationSearch from '../../components/LocationSearch';

const text = 'istanbul';

describe('LocationSearch', () => {
  function getSearchField() {
    return screen.getByRole('textbox');
  }

  function getSubmitButton() {
    return screen.getByRole('button', { name: 'Search' });
  }

  it('renders successfully', () => {
    render(<LocationSearch />);
    expect(getSearchField()).toBeInTheDocument();
  });

  it('shows the text value in state', () => {
    render(<LocationSearch />);
    expect(getSearchField()).toHaveValue('');

    userEvent.type(getSearchField(), text);
    expect(getSearchField()).toHaveValue(text);
  });

  it('routes to city page on submit', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <LocationSearch />
      </Router>
    );

    userEvent.type(getSearchField(), text);
    userEvent.click(getSubmitButton());

    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe(`/${text}`);
  });

  it('dismisses requests with empty strings', () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <LocationSearch />
      </Router>
    );

    userEvent.type(getSearchField(), '     ');
    userEvent.click(getSubmitButton());

    expect(history.length).toBe(1);
    expect(getSearchField()).toHaveValue('');
    expect(history.location.pathname).toBe('/');
  });
});
