
import React from 'react';

import SelectAllCheckbox from './SelectAllCheckbox';
import GifDropdown from './GifDropdown';
import ToggleButton from 'components/ToggleButton';
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
    <ToggleButton
      open={open}
      onClick={toggle} />
  </div>
);

export default GifGeneration;
