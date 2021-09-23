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
    <form onSubmit={handleFormSubmit} className='search-input__wrapper'>
      <input
        type='text'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type='submit'>Search</button>
    </form>
  );
}
