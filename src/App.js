
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoadingSpinner from 'components/UI/LoadingSpinner';
import PAGES from 'utils/pages';
import './App.css';

const Home = lazy(() => import(/* webpackChunkName: 'home' */ 'pages/Home'));
const Gallery = lazy(() => import(/* webpackChunkName: 'gallery' */ 'pages/Gallery'));

const App = () => (
  <div className='App'>
    <Router>
      <Suspense fallback={<LoadingSpinner centerViewport />}>
        <Switch>
          <Route
            exact
            path={PAGES.HOME}
            component={Home} />
          <Route
            exact
            path={PAGES.GALLERY}
            component={Gallery} />
        </Switch>
      </Suspense>
    </Router>
  </div>
);

export default App;
