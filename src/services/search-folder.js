
// ray test touch <
import config from 'config';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';

const searchFolder = async folderName => {
  let folderId = localStorage.getItem(LOCAL_STORAGE_KEYS.FOLDER_ID, '');
  if (folderId) {
    return folderId;
  }
  folderId = null;
	try {
    // TODO: double check usage and expose as common module
		await window.gapi.client.init({
			apiKey: config.API_KEY,
			clientId: config.CLIENT_ID,
			discoveryDocs: [config.DISCOVERY_DOCS],
			scope: `${config.READ_ONLY_SCOPE} ${config.FILE_SCOPE}`
		});

		const response = await window.gapi.client.drive.files.list({
			'q': `mimeType='application/vnd.google-apps.folder' and fullText contains '${folderName}' and trashed = false`,
			'fields': 'nextPageToken, files(id, name, parents)'
		});

		const files = response.result.files;
		if (files && files.length > 0) {
			folderId = files[0].id;
			localStorage.setItem(LOCAL_STORAGE_KEYS.FOLDER_ID, folderId);
		}
	} catch (error) {
		console.log('[searchFolder] error => ', error);
	}

	return folderId;
};

export default searchFolder;
// ray test touch >
