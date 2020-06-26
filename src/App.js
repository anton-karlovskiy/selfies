
import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoadingSpinner from 'components/UI/LoadingSpinner';
import useScript from 'utils/hooks/use-script';
import config from 'config';
import PAGES from 'utils/pages';
import './App.css';

const Home = lazy(() => import(/* webpackChunkName: 'home' */ 'pages/Home'));
const Gallery = lazy(() => import(/* webpackChunkName: 'gallery' */ 'pages/Gallery'));

const App = () => {
  const [loading, error] = useScript({
    src: 'https://apis.google.com/js/api.js',
    checkForExisting: true,
    async: true,
    defer: true,
    onload: () => {
      console.log('[GAPI script onload] window.gapi => ', window.gapi);
			gapiClientLoad();
    }
  });

  // TODO: loading spinner on buttons
  console.log('[App] GAPI script loading => ', loading);
  console.log('[App] GAPI script error => ', error);
  
  // TODO: double check rendering -> just two times due to the following
	const [signedIn, setSignedIn] = useState(false);

  const gapiClientLoad = () => {
		// TODO: cache logic by local storage to avoid unnecessary request
		// RE: https://github.com/google/google-api-javascript-client/blob/master/docs/auth.md#the-standalone-auth-client
		// RE: https://github.com/google/google-api-javascript-client/blob/master/docs/samples.md#authorizing-and-making-authorized-requests
		// Load the auth2 library
		window.gapi.load('auth2', gapiInitAuth2);
  };
  
  const gapiInitAuth2 = () => {
		const gapiAuth2 = window.gapi.auth2;

		gapiAuth2.init({
			apiKey: config.API_KEY,
			clientId: config.CLIENT_ID,
			scope: config.READ_ONLY_SCOPE // TODO: double check the scope
		}).then(() => {
			// TODO: cache logic by local storage to avoid unnecessary request when reloading
			const authInstance = gapiAuth2.getAuthInstance();

			// Listen for sign-in state changes.
			authInstance.isSignedIn.listen(updateSigninStatus);

			// Handle the initial sign-in state.
			updateSigninStatus(authInstance.isSignedIn.get());
		});
	};

	const updateSigninStatus = newSignedIn => {
		console.log('[App updateSigninStatus] signedIn, newSignedIn => ', signedIn, newSignedIn);
		if (newSignedIn !== signedIn) {
			setSignedIn(newSignedIn);
		}
	};

	const signInHandler = useCallback(() => {
		window.gapi.auth2.getAuthInstance().signIn();
	}, []);

	const signOutHandler = useCallback(() => {
		window.gapi.auth2.getAuthInstance().signOut();
	}, []);
  
  return (
    <div className='App'>
      <Router>
        <Suspense fallback={<LoadingSpinner centerViewport />}>
          <Switch>
            <Route
              exact
              path={PAGES.HOME}
              render={
                props => (
                  <Home
                    signedIn={signedIn}
                    signIn={signInHandler}
                    signOut={signOutHandler}
                    {...props} />
                )
              } />
            {/* TODO: block unsigned routing to gallery in the router level */}
            <Route
              exact
              path={PAGES.GALLERY}
              component={Gallery} />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
