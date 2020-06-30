
// TODO: handle rejected for error
const getImageRatio = src => new Promise((resolved, rejected) => {
  const image = new Image();
  image.onload = function() {
    resolved(image.width / image.height);
  };
  image.src = src;
});

export default getImageRatio;
