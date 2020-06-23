
// TODO: double check the algorithm
// TODO: use tring interpolation
const generateImageFile = (base64Data, metaData) => {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelimiter = "\r\n--" + boundary + "--";
  const contentType = 'image/jpeg' || 'application/octet-stream';
  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    JSON.stringify(metaData) +
    delimiter +
    'Content-Type: ' + contentType + '\r\n' +
    'Content-Transfer-Encoding: base64\r\n' +
    '\r\n' +
    base64Data +
    closeDelimiter;
  
  const request = window.gapi.client.request({
    path: '/upload/drive/v3/files',
    method: 'POST',
    params: {
      uploadType: 'multipart'
    },
    headers: {
      'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
    },
    body: multipartRequestBody
	});
	
	request.execute();
};

export default generateImageFile;
