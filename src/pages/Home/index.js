
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
			// TODO: cache logic by local storage to avoid unnecessary request
			const authInstance = gapiAuth2.getAuthInstance();

			// Listen for sign-in state changes.
			authInstance.isSignedIn.listen(updateSigninStatus);

			// Handle the initial sign-in state.
			updateSigninStatus(authInstance.isSignedIn.get());
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
