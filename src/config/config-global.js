
module.exports = {
	// TODO: could use CRA's env variables
	API_KEY: process.env.API_KEY,
	// RE: https://github.com/google/google-api-javascript-client/blob/master/docs/start.md#option-2-use-gapiclientrequest
	DISCOVERY_DOCS: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
	CLIENT_ID: process.env.CLIENT_ID,

	// TODO: double check the scope
	FILE_SCOPE: 'https://www.googleapis.com/auth/drive',
	READ_ONLY_SCOPE: 'https://www.googleapis.com/auth/drive.metadata.readonly',

	FOLDER_NAME: 'visage',
	FILE_PREFIX: 'visage-',
	// APP_ID: '663657110257', // TODO: not used
	// IDEAL_WIDTH: 720, // TODO: not used
	// IDEAL_HEIGHT: 405, // TODO: not used
	// TODO: do we need them for sure? what made us set like so?
	RESOLUTION_1: {WIDTH: 720, HEIGHT: 405},
	RESOLUTION_2: {WIDTH: 640, HEIGHT: 480},
	// TODO: we should have used https://github.com/google/google-api-javascript-client/blob/master/docs/cors.md instead of this proxy
	PREFIX_URL: 'https://cors-anywhere.herokuapp.com/',
	GIF_NAME: 'visage.gif',
	GIF_SIZES: [
		{WIDTH: 100, LABEL: 'Small'},
		{WIDTH: 200, LABEL: 'Medium'},
		{WIDTH: 400, LABEL: 'Large'}
	]
};
