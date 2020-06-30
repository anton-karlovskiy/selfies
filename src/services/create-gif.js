
import config from 'config';
import searchFolder from 'services/search-folder';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';
import convertBlobToBase64 from 'utils/helpers/convert-blob-to-base64';

const createGIF = async (oauthToken, images, width, height) => {
	const folderId = await searchFolder(config.FOLDER_NAME);

  let base64Images = [];
  for (const image of images) {
    try {
      const response = await fetch(`${config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT}/${image.id}?alt=media`, {
        headers: new Headers({
          'Authorization': `Bearer ${oauthToken}`
        })
      });
      const blob = await response.blob();
      const base64Image = await convertBlobToBase64(blob);
      base64Images.push(base64Image);
    } catch (error) {
      console.log('[createGIF] error => ', error);
    }
  }
  
	const options = {
    images: base64Images,
		// TODO: double check options usage
		gifWidth: width,
		gifHeight: height
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
};

export default createGIF;
