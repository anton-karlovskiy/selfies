
import React, { useState, useEffect } from 'react';

import CameraScreen from 'components/CameraScreen';
import Footer from 'parts/Footer';
import config from 'config';
import PAGES from 'utils/pages';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';

const Home = ({ history }) => {
	// ray test touch <
	const [signedIn, setSignedIn] = useState(true);

	useEffect(() => {
		if (window.gapi && window.gapi.client) {
			loadHandler();
		} else {
			setTimeout(loadHandler, 1000); // TODO: hardcoded & error prone
		}
	}, []);

	const loadHandler = async () => {
		try {
			await window.gapi.client.init({
				apiKey: config.apiKey,
				clientId: config.clientId,
				discoveryDocs: [config.discoveryDocs],
				scope: `${config.readOnlyScope} ${config.fileScope}`
			});
		} catch (error) {
			console.log('[Home loadHandler] error => ', error);
		}
		getSignInState();
	};

	const signOutHandler = () => {
		if (window.gapi.auth2.getAuthInstance()) {
			window.gapi.auth2.getAuthInstance().signOut();
			localStorage.removeItem(LOCAL_STORAGE_KEYS.FOLDER_ID);
			localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNED_IN, 'false');
			if (signedIn) {
				setSignedIn(false);
			}
		}
	};

	const signInHandler = async () => {
		try {
			if (!window.gapi.auth2.getAuthInstance()) {
				await window.gapi.auth2.init({ client_id: config.clientId });
			}
			await window.gapi.auth2.getAuthInstance().signIn();
			const signedIn_ = window.gapi.auth2.getAuthInstance().isSignedIn.get();
			if (signedIn !== signedIn_) {
				setSignedIn(signedIn_);
			}
			localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNED_IN, signedIn_);
		} catch (error) {
			console.log('[Home signInHandler] error =>', error);
		}
	};

	const navigateToGalleryHandler = () => {
		if (signedIn) {
			history.push(PAGES.GALLERY);
		}
	};

	const getSignInState = () => {
		let isSignedIn_ = true;
		try {
			isSignedIn_ = window.gapi.auth2.getAuthInstance().isSignedIn.get();
		} catch (error) {
			isSignedIn_ = false;
		}
		if (!isSignedIn_) {
			localStorage.removeItem(LOCAL_STORAGE_KEYS.FOLDER_ID);
			localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNED_IN, isSignedIn_);
		}
		if (signedIn !== isSignedIn_) {
			setSignedIn(signedIn);
		}
	};
	// ray test touch >
	
	return (
		<>
			<CameraScreen />
			<Footer
				signedIn={signedIn}
				signIn={signInHandler}
				signOut={signOutHandler}
				navigateToGallery={navigateToGalleryHandler} />
		</>
	);
};

export default Home;
