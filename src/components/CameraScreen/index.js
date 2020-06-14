import React from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import config from '../../config';
import { generateFileTitle, saveBase64AsImageFile, getCameraResolution } from '../../utils/utility';
import { searchFolder, createFolderAndUploadImageFile, uploadImageFile } from '../../utils/apis';
import 'react-html5-camera-photo/build/css/index.css';

const takePhotoHandler = async dataUri => {
	const isSignedIn = localStorage.getItem('isSignedIn') === 'true';
  if (!isSignedIn) {
    const filename = generateFileTitle();
		saveBase64AsImageFile(dataUri, filename);
		return;
  }

  const folderId = await searchFolder(config.folderName);
  if (folderId) {
    uploadImageFile(dataUri, folderId);
  } else {
    createFolderAndUploadImageFile(dataUri, config.folderName);
  }
};

const resolution = getCameraResolution();

const CameraScreen = () => (
	<Camera
		onTakePhoto={takePhotoHandler}
		idealFacingMode={FACING_MODES.USER}
		idealResolution={resolution}
		imageType={IMAGE_TYPES.JPG}
		imageCompression={0.97}
		isMaxResolution={false}
		isImageMirror={true}
		isFullscreen={true}
		isDisplayStartCameraError={false}
		sizeFactor={1} />
);

export default CameraScreen;