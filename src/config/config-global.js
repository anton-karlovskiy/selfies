module.exports = {
	clientId: process.env.CLIENT_ID,
	apiKey: process.env.API_KEY,
	fileScope: 'https://www.googleapis.com/auth/drive',
	readOnlyScope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
	discoveryDocs: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
	folderName: 'Selfie-Webapp',
	filePrefix: 'Selfie-',
	appId: '663657110257', // console.developer.google.com
	idealWidth: 720,
	idealHeight: 405,
	resolution1: { width: 720, height: 405 },
	resolution2: { width: 640, height: 480 },
	prefixUrl: 'https://cors-anywhere.herokuapp.com/',
	gifName: 'Selfie-Gif.gif',
	gifSizes: [
		{width: 100, label: 'Small'},
		{width: 200, label: 'Medium'},
		{width: 400, label: 'Large'}
	]
}