
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
  createPermission,
  deletePermission,
  getPermission
};