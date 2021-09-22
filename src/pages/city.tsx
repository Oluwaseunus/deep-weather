import { useState, useEffect } from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

import WeatherService from '../api/WeatherService';

interface RouteParams {
  city: string;
}

interface LocationState {
  cityData?: OWMResponse;
}

interface Note {
  id: string;
  text: string;
}

interface CityPageProps
  extends RouteComponentProps<
    RouteParams,
    StaticContext,
    LocationState | undefined
  > {}

export default function City({ history, location }: CityPageProps) {
  const [text, setText] = useState('');
  const [idToEdit, setIdToEdit] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [erorrMessage, setErrorMessage] = useState('');
  const [notes, setNotes] = useState<Note[]>(
    JSON.parse(localStorage.getItem('' + location.state?.cityData?.id) || '[]')
  );

  useEffect(() => {
    async function getCityData() {
      try {
        if (!location.state?.cityData) {
          // slicing by 1 to remove the "/" from the pathname
          const cityData = await WeatherService.getCityWeather(
            location.pathname.slice(1).replaceAll('-', ' ')
          );
          history.replace(location.pathname, { cityData });
        }
      } catch (err: any) {
        setErrorMessage(
          err.response.data.message || 'An unexpected error occured.'
        );
      } finally {
        setIsLoading(false);
      }
    }
    getCityData();
  }, [history, location.pathname, location.state?.cityData]);

  useEffect(() => {
    const notes =
      localStorage.getItem('' + location.state?.cityData?.id) || '[]';
    setNotes(JSON.parse(notes));
  }, [location.state?.cityData?.id]);

  useEffect(() => {
    if (location.state?.cityData) {
      localStorage.setItem(
        '' + location.state!.cityData!.id,
        JSON.stringify(notes)
      );
    }
  }, [notes, location.state]);

  function addToFavourites() {
    const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
    favourites.push(location.state?.cityData?.name);
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }

  function handleEdit(noteId: string) {
    setIdToEdit(noteId);
    setText(notes.find(({ id }) => id === noteId)!.text);
  }

  function removeNote(noteId: string) {
    return function () {
      setNotes(notes.filter(({ id }) => noteId !== id));
    };
  }

  function saveNote() {
    let updatedNotes: Note[] = notes;

    if (idToEdit) {
      updatedNotes = updatedNotes.map((note) =>
        note.id === idToEdit ? { ...note, text: text } : note
      );
    } else {
      updatedNotes = [...notes, { id: '' + Date.now(), text }];
    }

    setText('');
    setIdToEdit('');
    setNotes(updatedNotes);
  }

  const { cityData } = location.state || {};

  if (isLoading) return <span>Loading...</span>;

  if (!cityData) return <span>{erorrMessage}</span>;

  return (
    <div>
      <Link to='/'>Go Home</Link>
      <p>City Name: {cityData.name}</p>
      <p>Temperature: {cityData.main.temp}&deg;F</p>
      <button onClick={addToFavourites}>Add to Favourites</button>

      {notes.map(({ id, text }) => (
        <div key={id} style={{ display: 'flex' }}>
          <p onClick={() => handleEdit(id)}>{text}</p>
          <button onClick={removeNote(id)}>Remove note</button>
        </div>
      ))}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button onClick={saveNote}>Save Note</button>
    </div>
  );
}
