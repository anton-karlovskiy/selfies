
import config from 'config';

// TODO: double check the algorithm
const getCameraResolution = () => {
	const height = window.outerHeight;
	const width = window.outerWidth;
  const ratio = parseFloat(Math.min(width, height)) / Math.max(width, height);
  
  const resolution = {};
	if (ratio < 0.6) {
    // 16:9
    resolution.width = config.RESOLUTION_1.WIDTH;
    resolution.height = config.RESOLUTION_1.HEIGHT;
	} else {
    // 4:3
    resolution.width = config.RESOLUTION_2.WIDTH;
    resolution.height = config.RESOLUTION_2.HEIGHT;
  }
	return resolution;
};

export default getCameraResolution;
