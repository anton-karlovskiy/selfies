
module.exports = {
	APP_NAME: 'Selfies',
	GAPI_ENDPOINT: 'https://apis.google.com/js/api.js',
	V3_GOOGLE_DRIVE_FILES_API_ENDPOINT: 'https://www.googleapis.com/drive/v3/files',
	V3_GOOGLE_DRIVE_UPLOAD_FILES_API_ENDPOINT: 'https://www.googleapis.com/upload/drive/v3/files',
	IMAGE_MIME_TYPE: 'image/jpeg',
	// TODO: could use CRA's env variables
	API_KEY: process.env.API_KEY,
	CLIENT_ID: process.env.CLIENT_ID,

	// TODO: double check the scope usage
	GOOGLE_DRIVE_SCOPE: 'https://www.googleapis.com/auth/drive',

	FOLDER_NAME: 'selfies',
	FILE_PREFIX: 'selfies-',
	// APP_ID: '663657110257', // TODO: not used
	// IDEAL_WIDTH: 720, // TODO: not used
	// IDEAL_HEIGHT: 405, // TODO: not used
	// TODO: do we need them for sure? what made us set like so?
	RESOLUTION_1: {WIDTH: 720, HEIGHT: 405},
	RESOLUTION_2: {WIDTH: 640, HEIGHT: 480},
	GIF_NAME_PREFIX: 'selfies',
	GIF_SIZES: [
		{WIDTH: 100, LABEL: 'Small'},
		{WIDTH: 200, LABEL: 'Medium'},
		{WIDTH: 400, LABEL: 'Large'}
	]
};
