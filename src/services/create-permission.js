
// TODO: not used but keep it
import config from 'config';

const createPermission = async (oauthToken, fileId) => {
  try {
    const response = await fetch(`${config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT}/${fileId}/permissions`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${oauthToken}`
      }),
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });
    const json = await response.json();
    const permissionId = json.id;
    console.log('[createPermission] permissionId => ', permissionId);
    return permissionId;
  } catch (error) {
    console.log('[createPermission] error => ', error);
  }
};

export default createPermission;
