
// TODO: double check the algorithm
import config from 'config';
import generateFilename from 'utils/helpers/generate-filename';

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
    
    await fetch(`${config.V3_GOOGLE_DRIVE_UPLOAD_FILES_API_ENDPOINT}?uploadType=multipart&fields=id`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"',
        'Authorization': `Bearer ${oauthToken}`
      }),
      body: multipartRequestBody
    });
  } catch (error) {
    console.log('[uploadImageFile] error => ', error);
  }
};

export default uploadImageFile;
