
// TODO: double check the algorithm
// TODO: use string interpolation
import uploadImageFile from './upload-image-file';

const createFolderAndUploadImageFile = (dataUri, folderName) => {
  try {
    const accessToken = window.gapi.auth.getToken().access_token;
		const request = window.gapi.client.request({
      'path': '/drive/v3/files/',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      'body': {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder'
      }
		});

		request.execute(response => {
			uploadImageFile(dataUri, response.id);
		});
  }
  catch (error) {
    console.log('[createFolderAndUploadImageFile] error => ', error);
  }
};

export default createFolderAndUploadImageFile;
