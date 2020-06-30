
const getImageRatio = src => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = function() {
    resolve(image.width / image.height);
  };
  image.onerror = reject;
  image.src = src;
});

export default getImageRatio;
