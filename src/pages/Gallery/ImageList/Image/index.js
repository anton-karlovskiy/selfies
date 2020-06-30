
import React, { memo } from 'react';
import IdealImage from 'react-ideal-image';

import './image.css';

const Image = ({
  src,
  createdTime,
  selectedStatus,
  onClick
}) => {
  const date = new Date(createdTime);
  const createdDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  // MEMO: https://github.com/stereobooster/react-ideal-image/issues/153
  return (
    <div
      className='image-container'
      onClick={onClick}>
      <IdealImage
        className='image'
        // TODO: must be based on intrinsic width/height
        width={200}
        height={200}
        placeholder={{color: '#f06292'}}
        // TODO: double check width
        srcSet={[{width: 200, src}]}
        loader='image' />
      {selectedStatus && <span className='dot' />}
      <div className='created-date'>{createdDate}</div>
    </div>
  );
};

export default memo(Image);
