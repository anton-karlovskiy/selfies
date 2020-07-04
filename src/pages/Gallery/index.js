
import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	memo
} from 'react';

import GalleryHeader from './GalleryHeader';
import ImageList from './ImageList';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import AdaptiveImagesModal from 'components/AdaptiveImagesModal';
import config from 'config';
import createGIF from 'services/create-gif';
import searchFolder from 'services/search-folder';
import serializeToQueryParam from 'utils/helpers/serialize-to-query-param';
import getImageRatio from 'utils/helpers/get-image-ratio';
// ray test touch <
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
// ray test touch >

// ray test touch <
const getImagesFromGoogleDriveResponse = async (oauthToken, folderId, mimeType) => {
	const queryObject = {
		q: `mimeType="${mimeType}" and "${folderId}" in parents and fullText contains "${config.FILE_PREFIX}" and trashed = false`,
		fields: 'nextPageToken, files(id, createdTime, webContentLink)',
		spaces: 'drive',
		corpora: 'user'
	};
	const imagesFromGoogleDriveResponse = await fetch(serializeToQueryParam(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
		headers: new Headers({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${oauthToken}`
		})
	});

	return imagesFromGoogleDriveResponse;
};
// ray test touch >

const Gallery = ({
	oauthToken,
	// ray test touch <
	loadingGAPI,
	loadingAuth2GAPI,
	errorGAPI,
	errorAuth2GAPI,
	// ray test touch >
}) => {
	const [images, setImages] = useState([]);
	const [gifGenerationOpen, setGifGenerationOpen] = useState(false);
	// RE: Get Unique Values From An Array from https://blog.bitsrc.io/10-super-useful-tricks-for-javascript-developers-f1b76691199b
	const [selectedStatusList, setSelectedStatusList] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [imagesModalOpen, setImagesModalOpen] = useState(false);
	const [currentModalIndex, setCurrentModalIndex] = useState(null);
	const [loadingImagesFromGoogleDrive, setLoadingImagesFromGoogleDrive] = useState(true);


	// ray test touch <
	const getImagesFromGoogleDrive = async (oauthToken, folderId = '', mimeType) => {
	// ray test touch >
		try {
			// ray test touch <
			let imagesFromGoogleDriveResponse = await getImagesFromGoogleDriveResponse(oauthToken, folderId, mimeType);
			if (imagesFromGoogleDriveResponse.status === 401) {
				const refreshedOauthToken = getRefreshedOauthToken();
				imagesFromGoogleDriveResponse = await getImagesFromGoogleDriveResponse(refreshedOauthToken, folderId, mimeType);
			}
			// ray test touch >
			const imagesFromGoogleDriveJson = await imagesFromGoogleDriveResponse.json();

			const images = imagesFromGoogleDriveJson.files.map(file => ({
				id: file.id,
				src: file.webContentLink,
				createdTime: file.createdTime
			}));
			images.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));

			setImages(images);
			setSelectedStatusList(new Array(images.length).fill(false));
			setLoadingImagesFromGoogleDrive(false);
		} catch (error) {
			console.log('[Gallery getImagesFromGoogleDrive] error => ', error.name, error.message);
			// ray test touch <
			// TODO: directly here refresh token without using local state
			// setErrorImagesFromGoogleDrive(error.message);
			// ray test touch >
			setLoadingImagesFromGoogleDrive(false);
		}
	};
	
	const initGalleryHandler = async oauthToken => {
		const folderId = await searchFolder(oauthToken, config.FOLDER_NAME);
		getImagesFromGoogleDrive(oauthToken, folderId, config.IMAGE_MIME_TYPE);
	};

	// ray test touch <
	useEffect(() => {
		if (!loadingGAPI && !loadingAuth2GAPI) {
			if (errorGAPI === null && errorAuth2GAPI === null) {
				console.log('[Gallery useEffect] init gallery');
				initGalleryHandler(oauthToken);
			} else {
				console.log('[Gallery useEffect] something went wrong errorGAPI, errorAuth2GAPI => ', errorGAPI, errorAuth2GAPI);
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadingGAPI, loadingAuth2GAPI, errorGAPI, errorAuth2GAPI]);
	// ray test touch >

	// ray test touch <
	// useEffect(() => {
	// 	// TODO: Invalid Credentials hardcoded
	// 	if (errorImagesFromGoogleDrive === 'Invalid Credentials') {
	// 		try {
	// 			const refreshedOauthToken = getRefreshedOauthToken();
	// 			console.log('[Gallery useEffect Invalid Credentials] refreshedOauthToken => ', refreshedOauthToken);
	// 			initGalleryHandler(refreshedOauthToken);
	// 		} catch (error) {
	// 			console.log('[Gallery useEffect Invalid Credentials] error => ', error);
	// 			signOut();
	// 			history.replace(PAGES.HOME);
	// 		}
	// 	}
	// // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [errorImagesFromGoogleDrive]);
	// ray test touch >

	const toggleGifGenerationHandler = useCallback(() => {
		setGifGenerationOpen(prevState => !prevState);
	}, [setGifGenerationOpen]);

	const toggleImage = useCallback(index => {
		setSelectedStatusList(prevState => {
			const nextState = [...prevState];
			nextState[index] = !nextState[index];
			return nextState;
		});
	}, [setSelectedStatusList]);

	const toggleAllImagesHandler = useCallback(event => {
		event.persist();
		setSelectedStatusList(prevState => [...prevState].fill(event.target.checked)); // for immutable
		setAllSelected(event.target.checked);
	}, [setSelectedStatusList, setAllSelected]);

	const closeImagesModalHandler = useCallback(() => {
		setImagesModalOpen(false);
		setCurrentModalIndex(null);
	}, [setImagesModalOpen]);

	const openImagesModal = useCallback(index => {
		setImagesModalOpen(true);
		setCurrentModalIndex(index);
	}, [setImagesModalOpen, setCurrentModalIndex]);

	const imageOnClickHandler = useCallback(index => () => {
		if (gifGenerationOpen) {
			toggleImage(index);
		} else {
			openImagesModal(index);
		}
	}, [gifGenerationOpen, toggleImage, openImagesModal]);

	const createGifHandler = useCallback(async (width, filename) => {
		const selectedImages = images.filter((_, index) => selectedStatusList[index]);
		
		if (selectedImages.length > 0) {
			// TODO: how to handle if ratio is not consistent across photos
			const ratio = await getImageRatio(selectedImages[0].src);
			const height = width / ratio;
			await createGIF(oauthToken, selectedImages, width, height, filename);
		}
	}, [images, selectedStatusList, oauthToken]); // TODO: shallow compare

	const selectedImagesCount = useMemo(() => (selectedStatusList.filter(selectedStatusListItem => selectedStatusListItem) || []).length, [selectedStatusList]);
	const gifButtonDisabled = selectedImagesCount === 0;

	return (
		<>
			<GalleryHeader
				gifButtonDisabled={gifButtonDisabled}
				gifGenerationOpen={gifGenerationOpen}
				toggleGifGeneration={toggleGifGenerationHandler}
				allSelected={allSelected}
				toggleAllImages={toggleAllImagesHandler}
				createGif={createGifHandler} />
			{/* ray test touch < */}
			{loadingGAPI || loadingAuth2GAPI || loadingImagesFromGoogleDrive ? (
			// ray test touch >
				<LoadingSpinner centerViewport />
			) : (
				<ImageList
					images={images}
					selectedStatusList={selectedStatusList}
					onClick={imageOnClickHandler} />
			)}
			<AdaptiveImagesModal
				views={images}
				open={imagesModalOpen}
				onClose={closeImagesModalHandler}
				currentIndex={currentModalIndex} />
		</>
	);
};

export default memo(Gallery);
