
// TODO: double check the algorithm
// TODO: use string interpolation
import generateFilename from 'utils/helpers/generate-filename';
import generateImageFile from './generate-image-file';

const uploadImageFile = (dataUri, folderId) => {
  window.gapi.client.load('drive','v3', () => {
    const filename = generateFilename();
    const mimeType = 'image/jpeg';
    const metaData = {
      name: filename,
      mimeType: mimeType,
      parents: [folderId]
    };
    const pattern = 'data:' + mimeType + ';base64,';
    const base64Data = dataUri.replace(pattern, '');
    generateImageFile(base64Data, metaData);
  });
};

export default uploadImageFile;
