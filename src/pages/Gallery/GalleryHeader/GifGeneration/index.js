
import React, { useState, useCallback } from 'react';

import SelectAllCheckbox from './SelectAllCheckbox';
import GifDropdown from './GifDropdown';
import GifToggleButton from 'components/GifToggleButton';
import './gif-generation.css';

const GifGeneration = ({
  open,
  toggle,
  toggleAllImages,
  allSelected,
  createGif
}) => {
  const [loadingGif, setLoadingGif] = useState(false);

  const openLoadingGifHandler = useCallback(() => {
    setLoadingGif(true);
  }, [setLoadingGif]);

  const closeLoadingGifHandler = useCallback(() => {
    setLoadingGif(false);
  }, [setLoadingGif]);

  return (
    <div className='gif-generation'>
      {open && (
        <>
          <SelectAllCheckbox
            disabled={loadingGif}
            checked={allSelected}
            onChange={toggleAllImages} />
          <GifDropdown
            loading={loadingGif}
            openLoadingGif={openLoadingGifHandler}
            closeLoadingGif={closeLoadingGifHandler}
            createGif={createGif} />
        </>
      )}
      <GifToggleButton
        disabled={loadingGif}
        open={open}
        onClick={toggle} />
    </div>
  );
};

export default GifGeneration;
