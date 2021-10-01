import { Link } from 'react-router-dom';
import { getUrlSlug } from '../utils/functions';

interface CityListingProps {
  cityData: OWMResponse;
  removeCity: (cityName: string) => void;
}

export default function CityListing({
  cityData,
  removeCity,
}: CityListingProps) {
  return (
    <li className='citylist-item'>
      <Link
        className='citylist-item-name'
        to={{
          state: { cityData },
          pathname: `/${getUrlSlug(cityData.name)}`,
        }}
      >
        {cityData.name}
      </Link>
      <p className='citylist-item-temp'>
        {Math.round(cityData.main.temp)}&deg;F
      </p>
      <button className='danger' onClick={() => removeCity(cityData.name)}>
        Remove Item
      </button>
    </li>
  );
}
