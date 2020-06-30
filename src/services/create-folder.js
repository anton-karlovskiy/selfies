
import config from 'config';

const createFolder = async (oauthToken, folderName) => {
  try {
    const response = await fetch(config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT, {
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
    const json = await response.json();
    const folderId = json.id;
    console.log('[createFolder] folderId => ', folderId);

    return folderId;
  }
  catch (error) {
    console.log('[createFolder] error => ', error);
  }
};

export default createFolder;
