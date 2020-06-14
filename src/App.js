
import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner';
import { routes } from './utils/links';
import './App.css';

const Home = lazy(() => import('./containers/Home'));
const Gallery = lazy(() => import('./containers/Gallery'));
const NoMatch = lazy(() => import('./components/NoMatch'));

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Switch>
              <Route exact path={routes.home} component={Home} />
              <Route exact path={routes.gallery} component={Gallery} />
              <Route component={NoMatch}/>
            </Switch>
          </Suspense>
        </Router>
      </div>
    );
  }
}

export default App;
