
import config from 'config';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';

const addFolder = async (oauthToken, folderName) => {
  const addedFolderResponse = await fetch(config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${oauthToken}`
    }),
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  return addedFolderResponse;
};

const getNewFolderId = async (oauthToken, folderName) => {
  try {
    let addedFolderResponse = await addFolder(oauthToken, folderName);
    if (addedFolderResponse.status === 401) {
      const refreshedOauthToken = getRefreshedOauthToken();
      addedFolderResponse = await addFolder(refreshedOauthToken, folderName);
    }
    const addedFolderJson = await addedFolderResponse.json();
    const folderId = addedFolderJson.id;
    console.log('[getNewFolderId] folderId => ', folderId);

    return folderId;
  }
  catch (error) {
    console.log('[getNewFolderId] error => ', error);
  }
};

export default getNewFolderId;
