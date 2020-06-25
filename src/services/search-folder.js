
import { LOCAL_STORAGE_KEYS } from 'utils/constants';
import serializeToQueryParam from 'utils/helpers/serialize-to-query-param';

// RE: https://developers.google.com/drive/api/v3/reference/files/list
const searchFolder = async folderName => {
  let folderId;
  // TODO: block cache for now
  // folderId = localStorage.getItem(LOCAL_STORAGE_KEYS.FOLDER_ID, '');
  if (folderId) {
    return folderId;
  }

	try {
    const v3GoogleDriveFilesAPI = 'https://www.googleapis.com/drive/v3/files';
    const queryObject = {
      q: `mimeType="application/vnd.google-apps.folder" and fullText contains "${folderName}" and trashed=false`,
      fields: 'nextPageToken, files(id)',
      spaces: 'drive',
      corpora: 'user'
    };
    const response = await window.gapi.client.request({
      path: serializeToQueryParam(queryObject, v3GoogleDriveFilesAPI)
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
