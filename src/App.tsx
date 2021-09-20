import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import HomePage from './pages';
import CityPage from './pages/city';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/:city' component={CityPage} />
        </Switch>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
