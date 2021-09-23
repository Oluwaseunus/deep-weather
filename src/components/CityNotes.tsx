import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import StorageService from '../utils/StorageService';

interface Note {
  id: string;
  text: string;
}

interface LocationState {
  cityData?: OWMResponse;
}

export default function CityNotes() {
  const [text, setText] = useState('');
  const [idToEdit, setIdToEdit] = useState('');
  const location = useLocation<LocationState>();
  const [notes, setNotes] = useState<Note[]>(
    StorageService.get('' + location.state?.cityData?.id) || []
  );

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

  return (
    <div>
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
