
// ray test touch <
import React, { useState, useEffect } from 'react';

import CameraScreen from 'components/CameraScreen';
import config from 'config';
import PAGES from 'utils/pages';
import './home.css';

const Home = ({ history }) => {
	const [isSignedIn, setIsSignedIn] = useState(true);

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
			localStorage.removeItem('folderId');
			localStorage.setItem('isSignedIn', 'false');
			if (isSignedIn) {
				setIsSignedIn(false);
			}
		}
	};

	const signInHandler = async () => {
		try {
			if (!window.gapi.auth2.getAuthInstance()) {
				await window.gapi.auth2.init({ client_id: config.clientId });
			}
			await window.gapi.auth2.getAuthInstance().signIn();
			const signedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
			if (isSignedIn !== signedIn) {
				// setState({ isSignedIn: signedIn });
				setIsSignedIn(signedIn);
			}
			localStorage.setItem('isSignedIn', signedIn);
		} catch (error) {
			console.log('[Home signInHandler] error =>', error);
		}
	};

	const navigateToGalleryHandler = () => {
		if (isSignedIn) {
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
			localStorage.removeItem('folderId');
			localStorage.setItem('isSignedIn', isSignedIn_);
		}
		if (isSignedIn !== isSignedIn_) {
			setIsSignedIn(isSignedIn);
		}
	};
	
	const galleryButtonStyle = isSignedIn ? 'icon-button library' : 'icon-button library disabled';

	return (
		<>
			<footer
				className='controllers'>
				{!isSignedIn && (
					<div
						className='icon-button login'
						onClick={signInHandler} />
				)}
				{isSignedIn && (
					<div
						className='icon-button logout'
						onClick={signOutHandler} />
				)}
				<div
					className={galleryButtonStyle}
					onClick={navigateToGalleryHandler} />
			</footer>
			<div className='camera-screen'>
				<CameraScreen />
			</div>
		</>
	);
};

export default Home;
// ray test touch >
