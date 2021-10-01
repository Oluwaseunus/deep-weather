import { useHistory } from 'react-router';
import { useState, FormEvent } from 'react';
import { getUrlSlug } from '../utils/functions';

export default function LocationSearch() {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = searchQuery.trim();

    if (trimmed) {
      history.push(`/${getUrlSlug(trimmed)}`);
    } else {
      setSearchQuery('');
    }
  }

  return (
    <div className='search-form__wrapper'>
      <form onSubmit={handleFormSubmit} className='search-form'>
        <input
          type='text'
          value={searchQuery}
          className='search-input'
          placeholder='Search for a location'
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type='submit'>Search</button>
      </form>
    </div>
  );
}
