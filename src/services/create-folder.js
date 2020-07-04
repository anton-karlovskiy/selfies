
import config from 'config';
// ray test touch <
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';
// ray test touch >

// ray test touch <
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
// ray test touch >

const createFolder = async (oauthToken, folderName) => {
  try {
    // ray test touch <
    let addedFolderResponse = await addFolder(oauthToken, folderName);
    if (addedFolderResponse.status === 401) {
      const refreshedOauthToken = getRefreshedOauthToken();
      addedFolderResponse = await addFolder(refreshedOauthToken, folderName);
    }
    const addedFolderJson = await addedFolderResponse.json();
    const folderId = addedFolderJson.id;
    // ray test touch >
    console.log('[createFolder] folderId => ', folderId);

    return folderId;
  }
  catch (error) {
    console.log('[createFolder] error => ', error);
  }
};

export default createFolder;
