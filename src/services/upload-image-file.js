
// TODO: double check the algorithm
import config from 'config';
import generateFilename from 'utils/helpers/generate-filename';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';

const postImageFile = async (oauthToken, boundary, multipartRequestBody) => {
  const imageFileResponse = await fetch(`${config.V3_GOOGLE_DRIVE_UPLOAD_FILES_API_ENDPOINT}?uploadType=multipart&fields=id`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
      'Authorization': `Bearer ${oauthToken}`
    }),
    body: multipartRequestBody
  });

  return imageFileResponse;
};

const uploadImageFile = async (oauthToken, dataUri, folderId, mimeType) => {
  try {
    const filename = generateFilename();
    const metadata = {
      name: filename,
      mimeType,
      parents: [folderId]
    };
    const pattern = `data:${mimeType};base64,`;
    const base64Data = dataUri.replace(pattern, '');

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const closeDelimiter = "\r\n--" + boundary + "--";
    const contentType = metadata.mimeType || 'application/octet-stream';
    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + contentType + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      base64Data +
      closeDelimiter;
    
    const imageFileResponse = await postImageFile(oauthToken, boundary, multipartRequestBody);
    if (imageFileResponse.status === 401) {
      console.log('[uploadImageFile] refresh token');
      const refreshedOauthToken = getRefreshedOauthToken();
      await postImageFile(refreshedOauthToken, boundary, multipartRequestBody);
    }
  } catch (error) {
    console.log('[uploadImageFile] error => ', error);
  }
};

export default uploadImageFile;
