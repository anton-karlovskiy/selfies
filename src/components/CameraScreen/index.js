
import React, { memo } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import config from 'config';
import { generateFileTitle, saveBase64AsImageFile, getCameraResolution } from 'utils/utility';
import { searchFolder, createFolderAndUploadImageFile, uploadImageFile } from 'utils/apis';
import 'react-html5-camera-photo/build/css/index.css';
import './camera-screen.css';

// ray test touch <
const resolution = getCameraResolution();
// ray test touch >

const CameraScreen = ({ signedIn }) => {
	const onTakePhotoHandler = async dataUri => {
		// ray test touch <
		if (!signedIn) {
			const filename = generateFileTitle();
			saveBase64AsImageFile(dataUri, filename);
			return;
		}
	
		const folderId = await searchFolder(config.FOLDER_NAME);
		if (folderId) {
			uploadImageFile(dataUri, folderId);
		} else {
			createFolderAndUploadImageFile(dataUri, config.FOLDER_NAME);
		}
		// ray test touch >
	};

	return (
		<Camera
			onTakePhoto={onTakePhotoHandler}
			idealFacingMode={FACING_MODES.USER}
			idealResolution={resolution}
			imageType={IMAGE_TYPES.JPG}
			isFullscreen // TODO: tweak for correct aspect ratio
			isMaxResolution={true} />
	);
};

export default memo(CameraScreen);
