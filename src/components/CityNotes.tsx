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
    if (location.state?.cityData) {
      StorageService.store('' + location.state!.cityData!.id, notes);
    }
  }, [notes, location.state]);

  function handleEdit(noteId: string) {
    setIdToEdit(noteId);
    setText(notes.find(({ id }) => id === noteId)!.text);
  }

  function removeNote(noteId: string) {
    setNotes(notes.filter(({ id }) => noteId !== id));
  }

  function saveNote() {
    const trimmedText = text.trim();

    if (trimmedText) {
      let updatedNotes: Note[] = notes;

      if (idToEdit) {
        updatedNotes = updatedNotes.map((note) =>
          note.id === idToEdit ? { ...note, text: trimmedText } : note
        );
      } else {
        updatedNotes = [...notes, { id: '' + Date.now(), text: trimmedText }];
      }

      setText('');
      setIdToEdit('');
      setNotes(updatedNotes);
    }
  }

  return (
    <div className='city-notes'>
      <ul className='city-notes-list'>
        {notes.map(({ id, text }) => (
          <li key={id} className='city-notes-item'>
            <p onClick={() => handleEdit(id)}>{text}</p>
            <button className='danger' onClick={() => removeNote(id)}>
              Remove note
            </button>
          </li>
        ))}
      </ul>

      <div className='city-notes-form'>
        <textarea
          value={text}
          placeholder='Add a note'
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button onClick={saveNote}>Save Note</button>
      </div>
    </div>
  );
}
