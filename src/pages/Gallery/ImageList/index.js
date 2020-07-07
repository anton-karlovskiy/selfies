
import React, { memo } from 'react';

import Image from './Image';
import './image-list.css';

const ImageList = ({
  images,
  selectedStatusList,
  onClick
}) => (
  <div className='image-list'>
    {images.map((image, index) => (
      <Image
        key={image.id}
        src={image.thumbnailLink}
        createdTime={image.createdTime}
        selectedStatus={selectedStatusList[index]}
        onClick={onClick(index)} />
    ))}
  </div>
);

export default memo(ImageList);
