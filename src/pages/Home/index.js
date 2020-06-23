
import React, {
	useState,
	useEffect,
	useCallback
} from 'react';

import CameraScreen from 'components/CameraScreen';
import Footer from 'parts/Footer';
import config from 'config';
import PAGES from 'utils/pages';

const Home = ({ history }) => {
	const [signedIn, setSignedIn] = useState(false);
	
	useEffect(() => {
		console.log('[Home useEffect] window.gapi => ', window.gapi);
		gapiClientLoad();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const gapiClientLoad = () => {
		// Load the API client and auth2 library
		window.gapi.load('client:auth2', gapiInitClient); // TODO: double check https://github.com/google/google-api-javascript-client/blob/master/docs/auth.md#the-standalone-auth-client
	};

	const gapiInitClient = () => {
		// RE: double check https://github.com/google/google-api-javascript-client/blob/master/docs/cors.md#how-to-use-cors-to-access-google-apis
		// TODO: we could save script download size
		window.gapi.client.init({
			apiKey: config.API_KEY,
			clientId: config.CLIENT_ID,
			// ray test touch <
			discoveryDocs: [config.DISCOVERY_DOCS],
			// ray test touch >
			scope: `${config.READ_ONLY_SCOPE} ${config.FILE_SCOPE}` // TODO: double check the scope
		}).then(function () {
			// Listen for sign-in state changes.
			window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

			// Handle the initial sign-in state.
			updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
		});
	};

	const updateSigninStatus = newSignedIn => {
		console.log('[Home updateSigninStatus] signedIn, newSignedIn => ', signedIn, newSignedIn);
		setSignedIn(newSignedIn);
	};

	const signInHandler = useCallback(() => {
		window.gapi.auth2.getAuthInstance().signIn();
	}, []);

	const signOutHandler = useCallback(() => {
		window.gapi.auth2.getAuthInstance().signOut();
	}, []);

	const navigateToGalleryHandler = useCallback(() => {
		if (signedIn) {
			history.push(PAGES.GALLERY);
		}
	}, [signedIn, history]);
	
	return (
		<>
			<CameraScreen signedIn={signedIn} />
			<Footer
				signedIn={signedIn}
				signIn={signInHandler}
				signOut={signOutHandler}
				navigateToGallery={navigateToGalleryHandler} />
		</>
	);
};

export default Home;
