
import React, { Fragment } from 'react';

import Image from './Image';

const ImageList = ({ images, selectedStatusList, toggleHandler }) => {
  return (
    <Fragment>
      { images.map((image, index) => (
        <Image
          key={image.id}
          selectedStatus={selectedStatusList[index]}
          imageUrl={image.src}
          dateTime={image.dateTime}
          onToggle={() => toggleHandler(index)} />
      )) }
    </Fragment>
  );
};

export default ImageList;
