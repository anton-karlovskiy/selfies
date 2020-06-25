
import React, { memo } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import config from 'config';
import generateFilename from 'utils/helpers/generate-filename';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';
import getCameraResolution from 'utils/helpers/get-camera-resolution';
import searchFolder from 'services/search-folder';
import uploadImageFile from 'services/upload-image-file';
import createFolderAndUploadImageFile from 'services/create-folder-and-upload-image-file';
import 'react-html5-camera-photo/build/css/index.css';
import './camera-screen.css';

const resolution = getCameraResolution();

const uploadImageHandler = async dataUri => {
	// TODO: we could combine this logic into one
	const folderId = await searchFolder(config.FOLDER_NAME);
	if (folderId) {
		uploadImageFile(dataUri, folderId);
	} else {
		createFolderAndUploadImageFile(dataUri, config.FOLDER_NAME);
	}
};

const CameraScreen = ({	signedIn }) => {
	const onTakePhotoHandler = async dataUri => {
		if (!signedIn) {
			const filename = generateFilename();
			saveBase64AsImageFile(dataUri, filename);
			return;
		}

		if (window.gapi.client) {
			uploadImageHandler(dataUri);
		} else {
			window.gapi.load('client', () => {
				window.gapi.client.init({}).then(uploadImageHandler(dataUri));
			});
		}
	};

	return (
		<div className='camera-screen'>
			<Camera
				onTakePhoto={onTakePhotoHandler}
				idealFacingMode={FACING_MODES.USER}
				idealResolution={resolution} // TODO: do we need it for sure?
				imageType={IMAGE_TYPES.JPG}
				isFullscreen // TODO: tweak for correct aspect ratio
				isMaxResolution={true} />
		</div>
	);
};

export default memo(CameraScreen);
