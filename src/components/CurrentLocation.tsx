import Swal from 'sweetalert2';
import { useHistory } from 'react-router';
import { getUrlSlug, resolveLocation } from '../utils/functions';

export default function CurrentLocation() {
  const history = useHistory();

  async function getCurrentLocation() {
    try {
      const cityData = await resolveLocation();
      history.push(`/${getUrlSlug(cityData.name)}`, { cityData });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'We were unable to get your city from your coordinates. Please try searching instead.',
      });
    }
  }

  return (
    <div className='current-location__wrapper'>
      <button onClick={getCurrentLocation} type='button'>
        Get Current Location
      </button>
    </div>
  );
}
