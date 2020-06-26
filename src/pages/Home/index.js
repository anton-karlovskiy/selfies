
import React, {
	memo,
	useCallback
} from 'react';

import CameraScreen from 'components/CameraScreen';
import Footer from 'parts/Footer';

import PAGES from 'utils/pages';

const Home = ({
	history,
	signedIn,
	signIn,
	signOut
}) => {
	const navigateToGalleryHandler = useCallback(() => {
		history.push(PAGES.GALLERY);
	}, [history]);

	return (
		<>
			<CameraScreen signedIn={signedIn} />
			<Footer
				signedIn={signedIn}
				signIn={signIn}
				signOut={signOut}
				navigateToGallery={navigateToGalleryHandler} />
		</>
	);
};

export default memo(Home);
