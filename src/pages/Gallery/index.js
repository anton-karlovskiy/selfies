
import React, { useState, useEffect, useCallback } from 'react';

import GalleryHeader from './GalleryHeader';
import ImageList from './ImageList';
import LoadingSpinner from 'components/UI/LoadingSpinner';
import AdaptiveImagesModal from '../../components/AdaptiveImagesModal';
import config from 'config';
import createGIF from 'services/create-gif';
import searchFolder from 'services/search-folder';
import serializeToQueryParam from 'utils/helpers/serialize-to-query-param';
import validateArg from 'utils/helpers/validate-arg';
import getImageRatio from 'utils/helpers/get-image-ratio';

const Gallery = ({
	oauthToken,
	loadingGAPI,
	loadingAuth2GAPI
}) => {
	const [images, setImages] = useState([]);
	const [gifGenerationOpen, setGifGenerationOpen] = useState(false);
	// TODO: Get Unique Values From An Array from https://blog.bitsrc.io/10-super-useful-tricks-for-javascript-developers-f1b76691199b
	const [selectedStatusList, setSelectedStatusList] = useState([]);
	const [allSelected, setAllSelected] = useState(false);
	const [imagesModalOpen, setImagesModalOpen] = useState(false);
	const [currentModalIndex, setCurrentModalIndex] = useState(null);
	const [loading, setLoading] = useState(true);

	const getImagesFromGoogleDrive = useCallback(async (folderId = validateArg(), mimeType) => {
		try {
			const queryObject = {
				q: `mimeType="${mimeType}" and "${folderId}" in parents and fullText contains "${config.FILE_PREFIX}" and trashed = false`,
				fields: 'nextPageToken, files(id, createdTime, webContentLink)',
				spaces: 'drive',
				corpora: 'user'
			};
			const response = await fetch(serializeToQueryParam(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
				headers: new Headers({
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${oauthToken}`
				})
			});
			const json = await response.json();

			const images = json.files.map(file => ({
				id: file.id,
				src: file.webContentLink,
				createdTime: file.createdTime
			}));
			images.sort((a, b) => (a.createdTime < b.createdTime ? 1 : -1));

			setImages(images);
			setSelectedStatusList(new Array(images.length).fill(false));
			setLoading(false);
		} catch (error) {
			console.log('[Gallery getImagesFromGoogleDrive] error => ', error);
			// TODO: force sign out if 401 response comes via service
			setLoading(false);
		}
	}, [setLoading, setSelectedStatusList, setImages, oauthToken]);
	
	const initGalleryHandler = useCallback(async () => {
		const folderId = await searchFolder(oauthToken, config.FOLDER_NAME);
		getImagesFromGoogleDrive(folderId, config.IMAGE_MIME_TYPE);
	}, [getImagesFromGoogleDrive, oauthToken]);

	useEffect(() => {
		if (!loadingGAPI && !loadingAuth2GAPI) {
			console.log('[Gallery useEffect] init gallery');
			initGalleryHandler();
		}
	}, [loadingGAPI, loadingAuth2GAPI, initGalleryHandler]);

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
		setSelectedStatusList(prevState => prevState.fill(event.target.checked));
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

	const createGifHandler = async (width, filename) => {
		const selectedImages = images.filter((_, index) => selectedStatusList[index]);

		if (selectedImages.length > 0) {
			// TODO: how to handle if ratio is not consistent across photos
			const ratio = await getImageRatio(selectedImages[0].src);
			const height = width / ratio;
			await createGIF(oauthToken, selectedImages, width, height, filename);
		}
	};

	return (
		<>
			<GalleryHeader
				gifGenerationOpen={gifGenerationOpen}
				toggleGifGeneration={toggleGifGenerationHandler}
				allSelected={allSelected}
				toggleAllImages={toggleAllImagesHandler}
				createGif={createGifHandler} />
			{loadingGAPI || loading ? (
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

export default Gallery;
