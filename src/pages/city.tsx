import { useState, useEffect } from 'react';
import { StaticContext } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';

import WeatherService from '../api/WeatherService';
import StorageService from '../utils/StorageService';

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
  const [isFavourite, setIsFavourite] = useState(false);
  const [notes, setNotes] = useState<Note[]>(
    StorageService.get('' + location.state?.cityData?.id) || []
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
      StorageService.get<Note[]>('' + location.state?.cityData?.id) || [];
    setNotes(notes);
  }, [location.state?.cityData?.id]);

  useEffect(() => {
    if (location.state?.cityData) {
      StorageService.store('' + location.state!.cityData!.id, notes);
    }
  }, [notes, location.state]);

  useEffect(() => {
    const favourites = StorageService.get<string[]>('favourites') || [];
    const cityIsFavourite = favourites.includes(
      location.state?.cityData?.name || ''
    );

    setIsFavourite(cityIsFavourite);
  }, [location.state?.cityData?.name]);

  function addToFavourites() {
    const favourites = StorageService.get<string[]>('favourites') || [];
    favourites.push(location.state!.cityData!.name);
    StorageService.store('favourites', favourites);
    setIsFavourite(true);
  }

  function removeFromFavourites() {
    const favourites = StorageService.get<string[]>('favourites') || [];
    StorageService.store(
      'favourites',
      favourites.filter((city) => location.state!.cityData!.name !== city)
    );

    setIsFavourite(false);
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

      {isFavourite ? (
        <button type='button' onClick={removeFromFavourites}>
          Remove from Favourites
        </button>
      ) : (
        <button onClick={addToFavourites} type='button'>
          Add to Favourites
        </button>
      )}

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
