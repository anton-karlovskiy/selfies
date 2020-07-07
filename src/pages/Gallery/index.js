
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
import GalleryFooter from './GalleryFooter';
import config from 'config';
import generateGIF from 'services/generate-gif';
import getFolderId from 'services/get-folder-id';
import serializeToQueryParam from 'utils/helpers/serialize-to-query-param';
import getImageRatio from 'utils/helpers/get-image-ratio';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
import ContentWrapper from 'parts/ContentWrapper';

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

const Gallery = ({
	oauthToken,
	loadingGAPI,
	loadingAuth2GAPI,
	errorGAPI,
	errorAuth2GAPI
}) => {
	const [images, setImages] = useState([]);
	const [gifGenerationOpen, setGifGenerationOpen] = useState(false);
	// RE: Get Unique Values From An Array from https://blog.bitsrc.io/10-super-useful-tricks-for-javascript-developers-f1b76691199b
	const [selectedStatusList, setSelectedStatusList] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [imagesModalOpen, setImagesModalOpen] = useState(false);
	const [currentModalIndex, setCurrentModalIndex] = useState(null);
	const [loadingImagesFromGoogleDrive, setLoadingImagesFromGoogleDrive] = useState(true);

	const getImagesFromGoogleDrive = async (oauthToken, folderId = '', mimeType) => {
		try {
			let imagesFromGoogleDriveResponse = await getImagesFromGoogleDriveResponse(oauthToken, folderId, mimeType);
			if (imagesFromGoogleDriveResponse.status === 401) {
				console.log('[Gallery getImagesFromGoogleDrive] refresh token');
				const refreshedOauthToken = getRefreshedOauthToken();
				imagesFromGoogleDriveResponse = await getImagesFromGoogleDriveResponse(refreshedOauthToken, folderId, mimeType);
			}
			const imagesFromGoogleDriveJson = await imagesFromGoogleDriveResponse.json();

			const images = imagesFromGoogleDriveJson.files.map(file => ({
				id: file.id,
				src: file.webContentLink,
				createdTime: file.createdTime
			}));
			images.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));

			console.log('[Gallery getImagesFromGoogleDrive] images => ', images);

			setImages(images);
			setSelectedStatusList(new Array(images.length).fill(false));
			setLoadingImagesFromGoogleDrive(false);
		} catch (error) {
			console.log('[Gallery getImagesFromGoogleDrive] error => ', error);
			setLoadingImagesFromGoogleDrive(false);
		}
	};
	
	const initGalleryHandler = async oauthToken => {
		const folderId = await getFolderId(oauthToken, config.FOLDER_NAME);
		getImagesFromGoogleDrive(oauthToken, folderId, config.IMAGE_MIME_TYPE);
	};

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
			await generateGIF(oauthToken, selectedImages, width, height, filename);
		}
	}, [images, selectedStatusList, oauthToken]); // TODO: shallow compare

	const selectedImagesCount = useMemo(() => (selectedStatusList.filter(selectedStatusListItem => selectedStatusListItem) || []).length, [selectedStatusList]);
	const gifButtonDisabled = selectedImagesCount === 0;

	return (
		<>
			<ContentWrapper>
				<GalleryHeader
					gifButtonDisabled={gifButtonDisabled}
					gifGenerationOpen={gifGenerationOpen}
					toggleGifGeneration={toggleGifGenerationHandler}
					allSelected={allSelected}
					toggleAllImages={toggleAllImagesHandler}
					createGif={createGifHandler} />
				{loadingGAPI || loadingAuth2GAPI || loadingImagesFromGoogleDrive ? (
					<LoadingSpinner centerViewport />
				) : (
					<>
						<ImageList
							images={images}
							selectedStatusList={selectedStatusList}
							onClick={imageOnClickHandler} />
						<AdaptiveImagesModal
							views={images}
							open={imagesModalOpen}
							onClose={closeImagesModalHandler}
							currentIndex={currentModalIndex} />
					</>
				)}
			</ContentWrapper>
			<GalleryFooter />
		</>
	);
};

export default memo(Gallery);
