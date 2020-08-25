
import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	memo
} from 'react';

import ContentWrapper from 'parts/ContentWrapper';
import GalleryHeader from './GalleryHeader';
import ImageList from './ImageList';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import AdaptiveImagesModal from 'components/AdaptiveImagesModal';
import GalleryFooter from './GalleryFooter';
import Annotation from 'components/Annotation';
import config from 'config';
import generateGIF from 'services/generate-gif';
import getFolderId from 'services/get-folder-id';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
import serializeToQueryParams from 'utils/helpers/serialize-to-query-params';
import getImageRatio from 'utils/helpers/get-image-ratio';
import MESSAGES from 'utils/constants/messages';

const getImagesFromGoogleDriveResponse = async (oauthToken, folderId, mimeType) => {
	const queryObject = {
		q: `mimeType="${mimeType}" and "${folderId}" in parents and fullText contains "${config.FILE_PREFIX}" and trashed = false`,
		fields: 'nextPageToken, files(id, createdTime, thumbnailLink, webContentLink)',
		spaces: 'drive',
		corpora: 'user'
	};
	const imagesFromGoogleDriveResponse = await fetch(serializeToQueryParams(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
		headers: new Headers({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${oauthToken}`
		})
	});

	return imagesFromGoogleDriveResponse;
};

const Gallery = ({ oauthToken }) => {
	const [images, setImages] = useState([]);
	const [gifGenerationOpen, setGifGenerationOpen] = useState(false);
	// RE: Get Unique Values From An Array from https://blog.bitsrc.io/10-super-useful-tricks-for-javascript-developers-f1b76691199b
	const [selectedStatusList, setSelectedStatusList] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [imagesModalOpen, setImagesModalOpen] = useState(false);
	const [currentModalIndex, setCurrentModalIndex] = useState(null);
	const [loadingImagesFromGoogleDrive, setLoadingImagesFromGoogleDrive] = useState(true);
	const [errorImagesFromGoogleDrive, setErrorImagesFromGoogleDrive] = useState('');

	const getImagesFromGoogleDrive = async (oauthToken, folderId = '', mimeType) => {
		try {
			let imagesFromGoogleDriveResponse = await getImagesFromGoogleDriveResponse(oauthToken, folderId, mimeType);
			if (imagesFromGoogleDriveResponse.status === 401) {
				console.log('[Gallery getImagesFromGoogleDrive] refresh token');
				const refreshedOauthToken = getRefreshedOauthToken();
				imagesFromGoogleDriveResponse = await getImagesFromGoogleDriveResponse(refreshedOauthToken, folderId, mimeType);
			}
			const imagesFromGoogleDriveJson = await imagesFromGoogleDriveResponse.json();

			const images = imagesFromGoogleDriveJson?.files?.map(file => ({
				id: file.id,
				thumbnailLink: file.thumbnailLink,
				// TODO: we could use thumbnailLink as a workaround on mobile by considering the intrinsic dimension
				// src: file.webContentLink,
				// src: file.thumbnailLink.replace('s220', 's1280'),
				src: file.thumbnailLink,
				createdTime: file.createdTime
			})) || [];
			images.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));

			console.log('[Gallery getImagesFromGoogleDrive] images => ', images);

			setImages(images);
			setSelectedStatusList(new Array(images.length).fill(false));
			setLoadingImagesFromGoogleDrive(false);
		} catch (error) {
			console.log('[Gallery getImagesFromGoogleDrive] error => ', error);
			setErrorImagesFromGoogleDrive(MESSAGES.SOMETHING_WENT_WRONG);
			setLoadingImagesFromGoogleDrive(false);
		}
	};
	
	const initGalleryHandler = async oauthToken => {
		const folderId = await getFolderId(oauthToken, config.FOLDER_NAME);
		getImagesFromGoogleDrive(oauthToken, folderId, config.IMAGE_MIME_TYPE);
	};

	useEffect(() => {
		initGalleryHandler(oauthToken);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	const createGifHandler = useCallback(async (width, filename, callback) => {
		const selectedImages = images.filter((_, index) => selectedStatusList[index]);
		
		if (selectedImages.length > 0) {
			// TODO: how to handle if ratio is not consistent across photos
			const ratio = await getImageRatio(selectedImages[0].thumbnailLink);
			const height = width / ratio;
			await generateGIF(oauthToken, selectedImages, width, height, filename, callback);
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
				{loadingImagesFromGoogleDrive ? (
					<LoadingSpinner centerViewport />
				) : (
					<>
						{errorImagesFromGoogleDrive ? (
							<Annotation
								align='center'
								color='error'
								text={errorImagesFromGoogleDrive} />
						) : (
							<>
								{images.length > 0 ? (
									<ImageList
										images={images}
										selectedStatusList={selectedStatusList}
										onClick={imageOnClickHandler} />
								) : (
									<Annotation
										align='center'
										color='info'
										text={MESSAGES.NO_IMAGES} />
								)}
								<AdaptiveImagesModal
									views={images}
									open={imagesModalOpen}
									onClose={closeImagesModalHandler}
									currentIndex={currentModalIndex} />
							</>
						)}
					</>
				)}
			</ContentWrapper>
			<GalleryFooter />
		</>
	);
};

export default memo(Gallery);
