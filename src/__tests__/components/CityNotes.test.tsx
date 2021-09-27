import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import { istanbulData } from '../utils/data';
import CityNotes from '../../components/CityNotes';

function renderWithRouter() {
  const history = createMemoryHistory();
  history.push('/istanbul', { cityData: istanbulData });

  return render(
    <Router history={history}>
      <CityNotes />
    </Router>
  );
}

const getItem = jest.fn();
const setItem = jest.fn();
const notes = [
  {
    id: String(Date.now()),
    text: 'Istanbul notes.',
  },
];

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: getItem,
    setItem: setItem,
    removeItem: jest.fn(),
  },
});

describe('CityNotes', () => {
  beforeEach(() => {
    getItem.mockClear();
    setItem.mockClear();
  });

  it('renders successfully', () => {
    getItem.mockReturnValueOnce(JSON.stringify(notes));

    renderWithRouter();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/istanbul notes/i)).toBeInTheDocument();
  });

  it('edits existing notes', () => {
    const theseNotes = [
      ...notes,
      { id: String(Date.now() - 50000), text: 'Hello world.' },
    ];
    const additionalText = ' Addition!';

    getItem.mockReturnValueOnce(JSON.stringify(theseNotes));

    renderWithRouter();

    expect(screen.getByRole('textbox')).toHaveValue('');
    userEvent.click(screen.getByText(/istanbul notes/i));
    expect(screen.getByRole('textbox')).toHaveValue(theseNotes[0].text);

    userEvent.type(screen.getByRole('textbox'), additionalText);
    userEvent.click(screen.getByRole('button', { name: 'Save Note' }));

    expect(screen.getByText(/hello world./i)).toBeInTheDocument();
    expect(screen.getByText(/istanbul notes. addition!/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');

    theseNotes[0].text += additionalText;
    expect(setItem).toBeCalledWith(
      '' + istanbulData.id,
      JSON.stringify(theseNotes)
    );
  });

  it('removes existing notes', () => {
    getItem.mockReturnValueOnce(JSON.stringify(notes));

    renderWithRouter();

    userEvent.click(screen.getByRole('button', { name: 'Remove note' }));
    expect(screen.queryByText(/istanbul notes/i)).not.toBeInTheDocument();
    expect(setItem).toBeCalledWith('' + istanbulData.id, JSON.stringify([]));
  });

  it('adds new notes', () => {
    getItem.mockReturnValueOnce(JSON.stringify(notes));

    renderWithRouter();

    userEvent.type(screen.getByRole('textbox'), 'Brand new note!');
    userEvent.click(screen.getByRole('button', { name: /save note/i }));

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByText(/brand new note/i)).toBeInTheDocument();
    expect(setItem).toBeCalled();
  });

  it('updates localStorage when notes change', () => {
    getItem.mockReturnValueOnce(JSON.stringify(notes));

    const history = createMemoryHistory();

    const { rerender } = render(
      <Router history={history}>
        <CityNotes />
      </Router>
    );

    expect(screen.getByText(/istanbul notes/i)).toBeInTheDocument();
    expect(setItem).not.toBeCalled();

    history.push('/istanbul', { cityData: istanbulData });

    rerender(
      <Router history={history}>
        <CityNotes />
      </Router>
    );

    expect(setItem).toBeCalled();
  });
});
