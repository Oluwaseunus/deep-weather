import TopCities from '../components/TopCities';
import LocationSearch from '../components/LocationSearch';
import FavouriteCities from '../components/FavouriteCities';
import CurrentLocation from '../components/CurrentLocation';

export default function Home() {
  return (
    <div className='home-page'>
      <LocationSearch />

      <CurrentLocation />

      <FavouriteCities />

      <TopCities />
    </div>
  );
}
