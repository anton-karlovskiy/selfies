
import React, { memo } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import config from 'config';
import generateFilename from 'utils/helpers/generate-filename';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';
// ray test touch <
import {
	getCameraResolution
} from 'utils/utility';
import { searchFolder, createFolderAndUploadImageFile, uploadImageFile } from 'utils/apis';
// ray test touch >
import 'react-html5-camera-photo/build/css/index.css';
import './camera-screen.css';

// ray test touch <
const resolution = getCameraResolution();
// ray test touch >

const CameraScreen = ({	signedIn }) => {
	const onTakePhotoHandler = async dataUri => {
		// ray test touch <
		if (!signedIn) {
			const filename = generateFilename();
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
		<div className='camera-screen'>
			<Camera
				onTakePhoto={onTakePhotoHandler}
				idealFacingMode={FACING_MODES.USER}
				idealResolution={resolution}
				imageType={IMAGE_TYPES.JPG}
				isFullscreen // TODO: tweak for correct aspect ratio
				isMaxResolution={true} />
		</div>
	);
};

export default memo(CameraScreen);
