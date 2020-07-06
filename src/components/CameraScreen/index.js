
import React, { memo } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';

import ErrorMessage from './ErrorMessage';
import config from 'config';
import generateFilename from 'utils/helpers/generate-filename';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';
import getCameraResolution from 'utils/helpers/get-camera-resolution';
import getFolderId from 'services/get-folder-id';
import getNewFolderId from 'services/get-new-folder-id';
import uploadImageFile from 'services/upload-image-file';
import useMediaDevices from 'utils/hooks/use-media-devices';
import 'react-html5-camera-photo/build/css/index.css';
import './camera-screen.css';

const resolution = getCameraResolution();

const checkWebcam = media => !!(media?.devices || []).find(device => device.kind === 'videoinput');

const onTakePhotoAnimationDoneHandler = dataUri => {
	console.log('[CameraScreen onTakePhotoAnimationDoneHandler] dataUri => ', dataUri);
};

const onCameraErrorHandler = error => {
	console.log('[CameraScreen onCameraErrorHandler] error => ', error);
};

const onCameraStartHandler = stream => {
	console.log('[CameraScreen onCameraStart] stream => ', stream);
};

const onCameraStopHandler = () => {
	console.log('[CameraScreen onCameraStopHandler]');
};

const CameraScreen = ({
	loading,
	signedIn,
	oauthToken
}) => {
	const media = useMediaDevices();
	const hasWebcam = checkWebcam(media);

	const onTakePhotoHandler = async dataUri => {
		if (!signedIn) {
			const filename = generateFilename();
			saveBase64AsImageFile(dataUri, filename);
			return;
		}
	
		let folderId = await getFolderId(oauthToken, config.FOLDER_NAME);
		if (!folderId) {
			folderId = await getNewFolderId(oauthToken, config.FOLDER_NAME);
		}
		uploadImageFile(oauthToken, dataUri, folderId, config.IMAGE_MIME_TYPE);
	};

	return (
		<div className={`camera-screen ${loading ? 'disabled-capture-button' : ''}`}>
			{hasWebcam ? (
				<Camera
					isFullscreen
					onTakePhoto={onTakePhotoHandler}
					onTakePhotoAnimationDone={onTakePhotoAnimationDoneHandler}
					onCameraError={onCameraErrorHandler}
					onCameraStart={onCameraStartHandler}
					onCameraStop={onCameraStopHandler}
					idealFacingMode={FACING_MODES.USER}
					idealResolution={resolution} // TODO: do we need it for sure?
					imageType={IMAGE_TYPES.JPG}
					isMaxResolution={true} />
			) : (
				<ErrorMessage>A camera could not be found.</ErrorMessage>
			)}
		</div>
	);
};

// TODO: double check memo, useCallback, useMemo for reducing rendering times
export default memo(CameraScreen);
