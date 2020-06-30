
import React from 'react';

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
}) => (
  <div className='gif-generation'>
    {open && (
      <>
        <SelectAllCheckbox
          checked={allSelected}
          onChange={toggleAllImages} />
        <GifDropdown createGif={createGif} />
      </>
    )}
    <GifToggleButton
      open={open}
      onClick={toggle} />
  </div>
);

export default GifGeneration;
