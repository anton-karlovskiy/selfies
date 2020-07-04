
import config from 'config';
// ray test touch <
// import { LOCAL_STORAGE_KEYS } from 'utils/constants';
// import { saveState, loadState } from 'utils/helpers/local-storage';
// ray test touch >
import serializeToQueryParam from 'utils/helpers/serialize-to-query-param';
// ray test touch <
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
// ray test touch >

// ray test touch <
const getFolderIdResponse = async (oauthToken, folderName) => {
  const queryObject = {
    q: `mimeType="application/vnd.google-apps.folder" and fullText contains "${folderName}" and trashed=false`,
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
    corpora: 'user'
  };
  const folderIdResponse = await fetch(serializeToQueryParam(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${oauthToken}`
    })
  });

  return folderIdResponse;
};
// ray test touch >

// RE: https://developers.google.com/drive/api/v3/reference/files/list
const searchFolder = async (oauthToken, folderName) => {
  let folderId;
  try {
    // ray test touch <
    // TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
    // folderId = (loadState() || {})[LOCAL_STORAGE_KEYS.FOLDER_ID];
    // if (folderId) {
    //   console.log('[searchFolder] folderId from local storage => ', folderId);
    //   return folderId;
    // }
    // ray test touch >

    // ray test touch <
    // const queryObject = {
    //   q: `mimeType="application/vnd.google-apps.folder" and fullText contains "${folderName}" and trashed=false`,
    //   fields: 'nextPageToken, files(id, name)',
    //   spaces: 'drive',
    //   corpora: 'user'
    // };
    // const response = await fetch(serializeToQueryParam(queryObject, config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT), {
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${oauthToken}`
    //   })
    // });
    let folderIdResponse = await getFolderIdResponse(oauthToken, folderName);
    if (folderIdResponse.status === 401) {
      const refreshedOauthToken = getRefreshedOauthToken();
      folderIdResponse = getFolderIdResponse(refreshedOauthToken, folderName);
    }

    // You can check if status in the range 200 to 299
    // if (!folderIdResponse.ok) {
    //   throw new Error(folderIdResponse.statusText);
    // }

    const folderIdJson = await folderIdResponse.json();
    // ray test touch >

    const files = folderIdJson.files;
		if (files?.length > 0) {
      folderId = files[0].id;
      // ray test touch <
      // TODO: user might remove the folder without clearing local storage so we can cache it via workbox using proper cache strategy
      // saveState({[LOCAL_STORAGE_KEYS.FOLDER_ID]: folderId});
      // ray test touch >
    }

    console.log('[searchFolder] folderId from Google Drive => ', folderId);

    return folderId;
	} catch (error) {
		console.log('[searchFolder] error => ', error);
  }
};

export default searchFolder;
