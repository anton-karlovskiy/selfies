
// TODO: not used but keep it
import config from 'config';

const deletePermission = async (oauthToken, fileId, permissionId) => {
  try {
    await fetch(`${config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT}/${fileId}/permissions/${permissionId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': `Bearer ${oauthToken}`
      })
    });
  } catch (error) {
    console.log('[deletePermission] error => ', error);
  }
};

export default deletePermission;
