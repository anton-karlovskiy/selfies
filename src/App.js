
import React, {
  Suspense,
  lazy,
  useState
} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import LoadingSpinner from 'components/UI/LoadingSpinner';
import useScript from 'utils/hooks/use-script';
import config from 'config';
import { PAGES } from 'utils/constants/links';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';
import { loadState } from 'utils/helpers/local-storage';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
import eraseOauthToken from 'services/erase-oauth-token';
import './App.css';

const Home = lazy(() => import(/* webpackChunkName: 'home' */ 'pages/Home'));
const Gallery = lazy(() => import(/* webpackChunkName: 'gallery' */ 'pages/Gallery'));

const signInHandler = async () => {
  try {
    await window.gapi.auth2.getAuthInstance().signIn();
  } catch (error) {
    console.log('[signInHandler] error => ', error);
  }
};

const signOutHandler = async () => {
  try {
    await window.gapi.auth2.getAuthInstance().signOut();
  } catch (error) {
    console.log('[signOutHandler] error => ', error);
  }
};

const App = () => {
  const [loadingAuth2GAPI, setLoadingAuth2GAPI] = useState(true);
  const [errorAuth2GAPI, setErrorAuth2GAPI] = useState(null);
  const [loadingGAPI, errorGAPI] = useScript({
    src: config.GAPI_ENDPOINT,
    checkForExisting: true,
    async: true,
    defer: true,
    onload: () => {
      console.log('[GAPI script onload] window.gapi => ', window.gapi);
			gapiAuth2Load();
    },
    onerror: () => {
      setLoadingAuth2GAPI(false);
    }
  });

  console.log('[App] GAPI script loadingGAPI => ', loadingGAPI);
  console.log('[App] GAPI script errorGAPI => ', errorGAPI);
  console.log('[App] GAPI script loadingAuth2GAPI => ', loadingAuth2GAPI);
  console.log('[App] GAPI script errorAuth2GAPI => ', errorAuth2GAPI);
  
  // TODO: double check rendering -> just two times due to the following
  const [signedIn, setSignedIn] = useState(null);

  const gapiAuth2Load = () => {
    // RE: https://github.com/google/google-api-javascript-client/blob/master/docs/auth.md#the-standalone-auth-client
    // RE: https://github.com/google/google-api-javascript-client/blob/master/docs/cors.md#how-to-use-cors-to-access-google-apis
		// Load the auth2 library
		window.gapi.load('auth2', gapiAuth2Init);
  };
  
  const gapiAuth2Init = () => {
		const gapiAuth2 = window.gapi.auth2;

		gapiAuth2.init({
			apiKey: config.API_KEY,
      clientId: config.CLIENT_ID,
      scope: config.GOOGLE_DRIVE_SCOPE,
      // ray test touch <
      // MEMO: https://accounts.google.com/signin/oauth/error?authError=ChVyZWRpcmVjdF91cmlfbWlzbWF0Y2gSxwJUaGUgcmVkaXJlY3QgVVJJIGluIHRoZSByZXF1ZXN0LCBodHRwczovL3Zpc2FnZS04NmFmZS53ZWIuYXBwLCBkb2VzIG5vdCBtYXRjaCB0aGUgb25lcyBhdXRob3JpemVkIGZvciB0aGUgT0F1dGggY2xpZW50LiBUbyB1cGRhdGUgdGhlIGF1dGhvcml6ZWQgcmVkaXJlY3QgVVJJcywgdmlzaXQ6IGh0dHBzOi8vY29uc29sZS5kZXZlbG9wZXJzLmdvb2dsZS5jb20vYXBpcy9jcmVkZW50aWFscy9vYXV0aGNsaWVudC82NjM2NTcxMTAyNTctZmI2cWk0aGI0Zm5qYnIxYjQ5NWhhYWo4NGJ2NjkyZWkuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20_cHJvamVjdD02NjM2NTcxMTAyNTcaRWh0dHA6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYWNjb3VudHMvZG9jcy9PQXV0aDJMb2dpbiNzZXRyZWRpcmVjdHVyaSCQAw%3D%3D&client_id=663657110257-fb6qi4hb4fnjbr1b495haaj84bv692ei.apps.googleusercontent.com
      // uxMode: 'redirect',
      // ux_mode: 'redirect',
      // redirectUri: 'https://visage-86afe.web.app'
      // redirect_uri: 'http://localhost:3000' 
      // redirectUri: 'http://localhost:3000'
      // ray test touch >
		}).then(() => {
      setLoadingAuth2GAPI(false);
      
      const authInstance = gapiAuth2.getAuthInstance();

			// Listen for sign-in state changes.
      authInstance.isSignedIn.listen(updateSigninStatus);
      
			// Handle the initial sign-in state.
			updateSigninStatus(authInstance.isSignedIn.get());
		}).catch(error => {
      setLoadingAuth2GAPI(false);
      setErrorAuth2GAPI(error);
      console.log('[App gapiAuth2Init] error => ', error);
    });
	};

	const updateSigninStatus = newSignedIn => {
    console.log('[App updateSigninStatus] signedIn, newSignedIn => ', signedIn, newSignedIn);

    if (newSignedIn) {
      getRefreshedOauthToken();
    } else {
      eraseOauthToken();
    }
    
    // TODO: re-render
    setSignedIn(newSignedIn);
	};

  const oauthToken = (loadState() || {})[LOCAL_STORAGE_KEYS.OAUTH_TOKEN];
  console.log('[App] oauthToken => ', oauthToken);
  
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
                    {...props}
                    loading={loadingGAPI || loadingAuth2GAPI}
                    oauthToken={oauthToken}
                    signedIn={signedIn}
                    signIn={signInHandler}
                    signOut={signOutHandler} />
                )
              } />
            <Route
              exact
              path={PAGES.GALLERY}
              render={
                props => (
                  <>
                    {oauthToken ? (
                      <Gallery
                        {...props}
                        oauthToken={oauthToken}
                        loadingGAPI={loadingGAPI}
                        loadingAuth2GAPI={loadingAuth2GAPI}
                        errorGAPI={errorGAPI}
                        errorAuth2GAPI={errorAuth2GAPI} />
                    ) : (
                      <Redirect to={PAGES.HOME} />
                    )}
                  </>
                )
              } />
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
