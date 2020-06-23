
import config from 'config';
import { searchFolder, createPermission, deletePermission } from './apis';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';

const createGIF = async (imageUrlList, completeCallback, width, height) => {
  const folderId = await searchFolder(config.FOLDER_NAME);
  const res = await createPermission(folderId);
  if (res && res.result) {
		setTimeout(async () => {
			const imageUrlListForCors = imageUrlList.map(imageUrl => `${config.prefixUrl}${imageUrl}`);
			const param = {
				images: imageUrlListForCors.reverse(),
				interval: .4,
				gifWidth: width || 200,
				gifHeight: height || width || 200
			};
			const gifshot = await import('gifshot');
			await gifshot.createGIF(param, async obj => {
				if (!obj.error) {
					saveBase64AsImageFile(obj.image, config.GIF_NAME);
				} else {
					setTimeout(async () => {
						await gifshot.createGIF(param, obj => {
							if (!obj.error) {
								saveBase64AsImageFile(obj.image, config.GIF_NAME);
							} else {
								alert('Failed to creating gif');
								console.log('[createGIF failed] error =>', obj.error);
							}
						});
					}, 1000); // TODO: hardcoded
				}

				await deletePermission(folderId);
				setTimeout(completeCallback, 300); // TODO: hardcoded
			});
		}, 1500); // TODO: hardcoded
	} else {
		completeCallback();
	}
};

const getMetaInfo = (url, callback) => {
	let img = new Image();
	img.src = url;
  img.addEventListener('load', () => {
		if (img.naturalWidth && callback) {
			callback(parseFloat(img.naturalHeight) / img.naturalWidth);
		}
	});
};

export {
	createGIF,
	getMetaInfo
};