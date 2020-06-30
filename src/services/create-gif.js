
import config from 'config';
import searchFolder from 'services/search-folder';
import createPermission from 'services/create-permission';
import deletePermission from 'services/delete-permission';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';

const createGIF = async (oauthToken, imageSrcs, width, height) => {
	const folderId = await searchFolder(config.FOLDER_NAME);
  const permissionId = await createPermission(oauthToken, folderId);
  
	const imageSrcsWithCorsPrefixed = imageSrcs.map(imageSrc => `${config.CORS_PREFIX_URL}/${imageSrc}`);
	const options = {
		images: imageSrcsWithCorsPrefixed.reverse(),
		// TODO: double check options usage
		// interval: .4,
		gifWidth: width || 200,
		gifHeight: height || width || 200
  };
  
  console.log('[createGIF] options => ', options);
  
	const gifshot = await import('gifshot');
	await gifshot.createGIF(options, async obj => {
		if (!obj.error) {
			console.log('[createGIF] GIF successful');
			saveBase64AsImageFile(obj.image, config.GIF_NAME);
		} else {
			console.log('[createGIF] GIF error obj.error => ', obj.error);
		}
	});
	await deletePermission(oauthToken, folderId, permissionId);
};

export default createGIF;
