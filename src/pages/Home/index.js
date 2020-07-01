
import React, {
	memo,
	useCallback
} from 'react';

import CameraScreen from 'components/CameraScreen';
import Footer from 'parts/Footer';
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
			<CameraScreen
				signedIn={signedIn}
				oauthToken={oauthToken} />
			<Footer
				loading={loading}
				signedIn={signedIn}
				signIn={signIn}
				signOut={signOut}
				navigateToGallery={navigateToGalleryHandler} />
		</>
	);
};

export default memo(Home);
