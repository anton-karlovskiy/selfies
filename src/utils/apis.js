
import config from 'config';
import { generateFileTitle } from './utility';
import { LOCAL_STORAGE_KEYS } from 'utils/constants';

const searchFolder = async folderName => {
  let folderId = localStorage.getItem(LOCAL_STORAGE_KEYS.FOLDER_ID, '');
  if (folderId) {
    return folderId;
  }
  folderId = null;
	try {
    // TODO: double check usage and expose as common module
		await window.gapi.client.init({
			apiKey: config.API_KEY,
			clientId: config.CLIENT_ID,
			discoveryDocs: [config.DISCOVERY_DOCS],
			scope: `${config.READ_ONLY_SCOPE} ${config.FILE_SCOPE}`
		});

		const response = await window.gapi.client.drive.files.list({
			'q': `mimeType='application/vnd.google-apps.folder' and fullText contains '${folderName}' and trashed = false`,
			'fields': 'nextPageToken, files(id, name, parents)'
		});

		const files = response.result.files;
		if (files && files.length > 0) {
			folderId = files[0].id;
			localStorage.setItem(LOCAL_STORAGE_KEYS.FOLDER_ID, folderId);
		}
	} catch (error) {
		console.log('[searchFolder] error => ', error);
	}

	return folderId;
};

const uploadImageFile = (dataUri, folderId) => {
  window.gapi.client.load('drive','v3', () => {
    const fileTitle = generateFileTitle();
    const mimeType = 'image/jpeg';
    const metadata = {
      name: fileTitle,
      mimeType: mimeType,
      parents: [folderId]
    };
    const pattern = 'data:' + mimeType + ';base64,';
    const base64Data = dataUri.replace(pattern, '');
    generateImageFile(base64Data, metadata);
  });
};

const generateImageFile = (base64Data, metadata) => {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";
  const contentType = 'image/jpeg' || 'application/octet-stream';
  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n' +
    'Content-Transfer-Encoding: base64\r\n' +
    '\r\n' +
    base64Data +
    close_delim;
  
  const request = window.gapi.client.request({
    path : '/upload/drive/v3/files',
    method : 'POST',
    params : {
      uploadType : 'multipart'
    },
    headers : {
      'Content-Type' : 'multipart/mixed; boundary="' + boundary + '"'
    },
    body : multipartRequestBody
	});
	
	request.execute();
};

const createFolderAndUploadImageFile = (dataUri, folderName) => {
  try {
    const access_token = window.gapi.auth.getToken().access_token;
		const request = window.gapi.client.request({
      'path': '/drive/v3/files/',
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token,             
      },
      'body':{
        'name' : folderName,
        'mimeType' : 'application/vnd.google-apps.folder',
      }
		});

		request.execute( res => {
			uploadImageFile(dataUri, res.id);
		});
  }
  catch (error) {
    console.log('Failed in creating selfie folder. check sign in state');
  }
};

const createPermission = async fileId => {
  const res = await window.gapi.client.drive.permissions.create({
    'fileId': fileId,
    'resource': {
      'withLink': true,
      'role': 'reader',
      'type': 'anyone'
    }
  });
  return res;
};

const getPermission = async fileId => {
	const res = await window.gapi.client.drive.permissions.get({
		'fileId': fileId,
		'permissionId': 'anyoneWithLink'
	});
	return res;
};

const deletePermission = async fileId => {
  await window.gapi.client.drive.permissions.delete({
    'fileId': fileId,
    'permissionId': 'anyoneWithLink'
  });
};

export {
  searchFolder,
  uploadImageFile,
  createFolderAndUploadImageFile,
  createPermission,
  deletePermission,
  getPermission
};