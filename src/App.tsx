import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './pages';
import CityPage from './pages/city';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/:city' component={CityPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
