import { saveAs } from 'file-saver';
import config from '../config';
import { searchFolder, createPermission, deletePermission } from './apis';

const generateFileTitle = () => {
  const date = new Date();
  const fileTitle = `${config.filePrefix}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getTime()}.jpg`;
  return fileTitle;
};

const saveBase64AsImageFile = ( dataUri, fileName ) => {
  saveAs(dataUri, fileName);
};

const createGIF = async (imageUrlList, completeCallback, width, height) => {
  const folderId = await searchFolder(config.folderName);
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
					saveBase64AsImageFile(obj.image, config.gifName);
				} else {
					setTimeout(async () => {
						await gifshot.createGIF(param, obj => {
							if (!obj.error) {
								saveBase64AsImageFile(obj.image, config.gifName);
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

const getCameraResolution = () => {
	const height = window.outerHeight;
	const width = window.outerWidth;
	const ratio = parseFloat(Math.min(width, height)) / Math.max(width, height);
	if (ratio < 0.6) {
		// 16:9
		return config.resolution1;
	}
	// 4:3
	return config.resolution2;
};

export {
	generateFileTitle,
	saveBase64AsImageFile,
	createGIF,
	getMetaInfo,
	getCameraResolution
};