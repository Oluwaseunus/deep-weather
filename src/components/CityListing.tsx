import { Link } from 'react-router-dom';
import { getUrlSlug } from '../utils/functions';

interface CityListingProps {
  cityData: OWMResponse;
  removeCity: (cityName: string) => () => void;
}

export default function CityListing({
  cityData,
  removeCity,
}: CityListingProps) {
  return (
    <div style={{ display: 'flex' }}>
      <Link
        style={{ marginRight: '1rem' }}
        to={{
          state: { cityData },
          pathname: `/${getUrlSlug(cityData.name)}`,
        }}
      >
        {cityData.name}
      </Link>
      <p>{cityData.main.temp}&deg;F</p>
      <button onClick={removeCity(cityData.name)}>Remove Item</button>
    </div>
  );
}
