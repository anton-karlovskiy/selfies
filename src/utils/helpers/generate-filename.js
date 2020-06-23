
import config from 'config';

const generateFilename = () => {
  const date = new Date();
  const filename = `${config.FILE_PREFIX}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getTime()}.jpg`;
  return filename;
};

export default generateFilename;
