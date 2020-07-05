
import React, {
	memo,
	useCallback
} from 'react';

import CameraScreen from 'components/CameraScreen';
// ray test touch <
import HomeFooter from './HomeFooter';
import ContentWrapper from 'parts/ContentWrapper';
// ray test touch >
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
			<ContentWrapper>
				<CameraScreen
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
