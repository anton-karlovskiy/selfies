
import React, { Component, Fragment } from 'react';

import CameraScreen from '../../components/CameraScreen';
import config from '../../config';
import PAGES from 'utils/pages';
import './home.css';

class Home extends Component {
	state = {
		isSignedIn: true
	};

	componentDidMount() {
		if (window.gapi && window.gapi.client) {
			this.loadHandler();
		} else {
			setTimeout(this.loadHandler, 1000); // TODO: hardcoded & error prone
		}
	}

	loadHandler = async () => {
		try {
			await window.gapi.client.init({
				apiKey: config.apiKey,
				clientId: config.clientId,
				discoveryDocs: [config.discoveryDocs],
				scope: `${config.readOnlyScope} ${config.fileScope}`
			});
		} catch (error) {
			console.log('[Home componentDidMount] error =>', error);
		}
		this.getSignInState();
	};

	signOutHandler = () => {
		if (window.gapi.auth2.getAuthInstance()) {
			window.gapi.auth2.getAuthInstance().signOut();
			localStorage.removeItem('folderId');
			localStorage.setItem('isSignedIn', 'false');
			if (this.state.isSignedIn) {
				this.setState({isSignedIn: false});
			}
		}
	};

	signInHandler = async () => {
		const { isSignedIn } = this.state;

		try {
			if (!window.gapi.auth2.getAuthInstance()) {
				await window.gapi.auth2.init({ client_id: config.clientId });
			}
			await window.gapi.auth2.getAuthInstance().signIn();
			const signedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
			if (isSignedIn !== signedIn) {
				this.setState({ isSignedIn: signedIn });
			}
			localStorage.setItem('isSignedIn', signedIn);
		} catch (error) {
			console.log('[HomHomeePage signInHandler] error =>', error)
		}
	};

	navigateToGalleryHandler = () => {
		const { isSignedIn } = this.state;
		const { history } = this.props;
		if (isSignedIn) {
			history.push(PAGES.GALLERY);
		}
	};

	getSignInState = () => {
		let isSignedIn = true;
		try {
			isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
		} catch (error) {
			isSignedIn = false;
		}
		if (!isSignedIn) {
			localStorage.removeItem('folderId');
			localStorage.setItem('isSignedIn', isSignedIn);
		}
		if (this.state.isSignedIn !== isSignedIn) {
			this.setState({ isSignedIn });
		}
	};

	render() {
		const { isSignedIn } = this.state;
		const galleryButtonStyle = isSignedIn ? 'icon-button library' : 'icon-button library disabled';

		return (
			<Fragment>
				<footer
					className='controllers'>
					{!isSignedIn && (
						<div
							className='icon-button login'
							onClick={this.signInHandler} />
					)}
					{isSignedIn && (
						<div
							className='icon-button logout'
							onClick={this.signOutHandler} />
					)}
					<div
						className={galleryButtonStyle}
						onClick={this.navigateToGalleryHandler} />
				</footer>
				<div className='camera-screen'>
					<CameraScreen />
				</div>
			</Fragment>
		);
	}
}

export default Home;
