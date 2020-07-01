
import React from 'react';

import ProductLogoTitle from 'components/UI/ProductLogoTitle';
import GifGeneration from './GifGeneration';
import './gallery-header.css';

const GalleryHeader = ({
  gifButtonDisabled,
  gifGenerationOpen,
  toggleGifGeneration,
  toggleAllImages,
  allSelected,
  createGif
}) => (
  <div className='gallery-header'>
    <ProductLogoTitle />
    <GifGeneration
      gifButtonDisabled={gifButtonDisabled}
      open={gifGenerationOpen}
      toggle={toggleGifGeneration}
      toggleAllImages={toggleAllImages}
      allSelected={allSelected}
      createGif={createGif} />
  </div>
);

export default GalleryHeader;
