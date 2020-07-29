
import config from 'config';
import serializeToQueryParams from 'utils/helpers/serialize-to-query-params';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
// TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
// import { LOCAL_STORAGE_KEYS } from 'utils/constants';
// import { saveState, loadState } from 'utils/helpers/local-storage';

const getFolderIdResponse = async (oauthToken, folderName) => {
  const queryObject = {
    q: `mimeType="application/vnd.google-apps.folder" and fullText contains "${folderName}" and trashed=false`,
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
    corpora: 'user'
  };
  const folderIdResponse = await fetch(serializeToQueryParams(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${oauthToken}`
    })
  });

  return folderIdResponse;
};

// RE: https://developers.google.com/drive/api/v3/reference/files/list
const getFolderId = async (oauthToken, folderName) => {
  try {
    let folderId;
    // TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
    // folderId = (loadState() || {})[LOCAL_STORAGE_KEYS.FOLDER_ID];
    // if (folderId) {
    //   console.log('[getFolderId] folderId from local storage => ', folderId);
    //   return folderId;
    // }

    let folderIdResponse = await getFolderIdResponse(oauthToken, folderName);
    if (folderIdResponse.status === 401) {
      console.log('[getFolderId] refresh token');
      const refreshedOauthToken = getRefreshedOauthToken();
      folderIdResponse = await getFolderIdResponse(refreshedOauthToken, folderName);
    }
    const folderIdJson = await folderIdResponse.json();

    const files = folderIdJson.files;
		if (files?.length > 0) {
      folderId = files[0].id;
      // TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
      // saveState({[LOCAL_STORAGE_KEYS.FOLDER_ID]: folderId});
    }

    console.log('[getFolderId] folderId from Google Drive => ', folderId);

    return folderId;
	} catch (error) {
		console.log('[getFolderId] error => ', error);
  }
};

export default getFolderId;
