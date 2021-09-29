import { useHistory } from 'react-router';
import { getUrlSlug, resolveLocation } from '../utils/functions';

export default function CurrentLocation() {
  const history = useHistory();

  async function getCurrentLocation() {
    try {
      const cityData = await resolveLocation();
      history.push(`/${getUrlSlug(cityData.name)}`, { cityData });
    } catch (err: any) {
      alert('Failed');
    }
  }

  return (
    <button onClick={getCurrentLocation} type='button'>
      Get Current Location
    </button>
  );
}
