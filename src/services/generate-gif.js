
import config from 'config';
import saveBase64AsImageFile from 'utils/helpers/save-base64-as-image-file';
import convertBlobToBase64 from 'utils/helpers/convert-blob-to-base64';
import getRefreshedOauthToken from 'services/get-refreshed-oauth-token';

// TODO: https://google-chrome.atlassian.net/browse/GOOGLE-98?focusedCommentId=10789
// const getImageDownloadResponses = async (oauthToken, images) => {
//   const imageDownloads = images.map(image => fetch(`${config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT}/${image.id}?alt=media`, {
//     headers: new Headers({
//       'Authorization': `Bearer ${oauthToken}`
//     })
//   }));
//   const imageDownloadResponses = await Promise.all(imageDownloads);
//   return imageDownloadResponses;
// };

const getImageDownloadResponse = async (oauthToken, imageId) => {
  const imageDownloadResponse = await fetch(`${config.V3_GOOGLE_DRIVE_FILES_API_ENDPOINT}/${imageId}?alt=media`, {
    headers: new Headers({
      'Authorization': `Bearer ${oauthToken}`
    })
  });

  return imageDownloadResponse;
};

const generateGIF = async (oauthToken, images, width, height, filename) => {
  let base64Images = [];
  for (const image of images) {
    try {
      let imageDownloadResponse = await getImageDownloadResponse(oauthToken, image.id);
      if (imageDownloadResponse.status === 401) {
        console.log('[generateGIF] refresh token');
        const refreshedOauthToken = getRefreshedOauthToken();
        imageDownloadResponse = await getImageDownloadResponse(refreshedOauthToken, image.id);
      }
      const blob = await imageDownloadResponse.blob();
      const base64Image = await convertBlobToBase64(blob);
      base64Images.push(base64Image);
    } catch (error) {
      console.log('[generateGIF] error => ', error);
    }
  }

  // TODO: https://google-chrome.atlassian.net/browse/GOOGLE-98?focusedCommentId=10789
  // inspired by https://stackoverflow.com/questions/46241827/fetch-api-requesting-multiple-get-requests
  // try {
  //   let imageDownloadResponses = await getImageDownloadResponses(oauthToken, images);
  //   if (imageDownloadResponses[0].status === 401) {
  //     console.log('[generateGIF] refresh token');
  //     const refreshedOauthToken = getRefreshedOauthToken();
  //     imageDownloadResponses = await getImageDownloadResponses(refreshedOauthToken, images);
  //   }
  //   for (const imageDownloadResponse of imageDownloadResponses) {
  //     const blob = await imageDownloadResponse.blob();
  //     const base64Image = await convertBlobToBase64(blob);
  //     base64Images.push(base64Image);
  //   }
  // } catch (error) {
  //   console.log('[generateGIF] error => ', error);
  // }
  
	const options = {
    images: base64Images,
		// TODO: double check options usage
		gifWidth: width,
    gifHeight: height,
    interval: 0.2
  };
  
  console.log('[generateGIF] options => ', options);

	const gifshot = await import('gifshot');
	await gifshot.createGIF(options, async obj => {
		if (!obj.error) {
      console.log('[generateGIF] GIF successful');
      saveBase64AsImageFile(obj.image, filename);
		} else {
			console.log('[generateGIF] GIF error obj.error => ', obj.error);
		}
	});
};

export default generateGIF;
