
import React, {
	memo,
	useCallback
} from 'react';

import CameraScreen from 'components/CameraScreen';
import HomeFooter from './HomeFooter';
import ContentWrapper from 'parts/ContentWrapper';
import { PAGES } from 'utils/constants/links';

const Home = ({
	history,
	loading,
	oauthToken,
	signedIn,
	signIn,
	signOut
}) => {
	const navigateToGalleryHandler = useCallback(() => {
		history.push(PAGES.GALLERY);
	}, [history]);

	return (
		<>
			<ContentWrapper style={{paddingBottom: 0}}>
				<CameraScreen
					// TODO: actually we don't need to wait as long as we have the oauth token in the local storage
					// TODO: but we just wait until auth2 is loaded to confirm and refresh the oauth token
					loading={loading}
					signedIn={signedIn}
					oauthToken={oauthToken} />
			</ContentWrapper>
			<HomeFooter
				loading={loading}
				signedIn={signedIn}
				signIn={signIn}
				signOut={signOut}
				navigateToGallery={navigateToGalleryHandler} />
		</>
	);
};

export default memo(Home);
