
// ray test touch <
import { LOCAL_STORAGE_KEYS } from 'utils/constants';

// RE: https://developers.google.com/drive/api/v3/reference/files/list
// RE: https://developers.google.com/drive/api/v2/reference/
const searchFolder = async folderName => {
  let folderId;
  // TODO: block cache for now
  // folderId = localStorage.getItem(LOCAL_STORAGE_KEYS.FOLDER_ID, '');
  if (folderId) {
    return folderId;
  }

  // ray test touch <<
  const test = await window.gapi.client.request({
    path: 'https://www.googleapis.com/drive/v3/files'
  });
  console.log('ray : ***** test => ', test);
  // ray test touch >>

  // TODO: double check the approach
	try {
		const response = await window.gapi.client.drive.files.list({
			'q': `mimeType='application/vnd.google-apps.folder' and fullText contains '${folderName}' and trashed = false`,
			'fields': 'nextPageToken, files(id, name, parents)'
		});

		const files = response.result.files;
		if (files?.length > 0) {
			folderId = files[0].id;
			localStorage.setItem(LOCAL_STORAGE_KEYS.FOLDER_ID, folderId);
		}
	} catch (error) {
		console.log('[searchFolder] error => ', error);
  }
  
  console.log('[searchFolder] folderId => ', folderId);

	return folderId;
};

export default searchFolder;
// ray test touch >
