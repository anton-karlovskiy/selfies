
// TODO: doube check
import { saveAs } from 'file-saver';

const saveBase64AsImageFile = (dataUri, filename) => {
  // TODO: might be error prone in Safari
  saveAs(dataUri, filename);
};

export default saveBase64AsImageFile;
