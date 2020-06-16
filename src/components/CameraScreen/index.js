
import React from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import config from 'config';
import { generateFileTitle, saveBase64AsImageFile, getCameraResolution } from 'utils/utility';
import { searchFolder, createFolderAndUploadImageFile, uploadImageFile } from 'utils/apis';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';
import 'react-html5-camera-photo/build/css/index.css';

// ray test touch <
const onTakePhotoHandler = async dataUri => {
	const isSignedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNED_IN) === 'true';
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
// ray test touch >

const CameraScreen = () => (
	<Camera
		onTakePhoto={onTakePhotoHandler}
		idealFacingMode={FACING_MODES.USER}
		idealResolution={resolution}
		imageType={IMAGE_TYPES.JPG}
		isFullscreen // TODO: tweak for correct aspect ratio
		isMaxResolution={true} />
);

export default CameraScreen;
