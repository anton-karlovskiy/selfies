
import config from 'config';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';
import { saveState, loadState } from 'utils/helpers/local-storage';
import serializeToQueryParam from 'utils/helpers/serialize-to-query-param';

// RE: https://developers.google.com/drive/api/v3/reference/files/list
const searchFolder = async (oauthToken, folderName) => {
  let folderId;
  try {
    // TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
    folderId = (loadState() || {})[LOCAL_STORAGE_KEYS.FOLDER_ID];
    if (folderId) {
      console.log('[searchFolder] folderId from local storage => ', folderId);
      return folderId;
    }

    const queryObject = {
      q: `mimeType="application/vnd.google-apps.folder" and fullText contains "${folderName}" and trashed=false`,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
      corpora: 'user'
    };
    const response = await fetch(serializeToQueryParam(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oauthToken}`
      })
    });
    const json = await response.json();

    const files = json.files;
		if (files?.length > 0) {
      folderId = files[0].id;
      // TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
      saveState({[LOCAL_STORAGE_KEYS.FOLDER_ID]: folderId});
		}
	} catch (error) {
		console.log('[searchFolder] error => ', error);
  }
  
  console.log('[searchFolder] folderId from Google Drive => ', folderId);

	return folderId;
};

export default searchFolder;
