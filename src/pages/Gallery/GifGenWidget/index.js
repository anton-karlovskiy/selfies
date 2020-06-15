
import React, { Fragment } from 'react';

import GifSizeMenu from './GifSizeMenu';
import SelectAllCheckbox from './SelectAllCheckbox';
import ToggleButton from '../../../components/ToggleButton';

const GifGenWidget = ({ allSelected, toggleAllImages, createGif, disabled, isOpen, toggleWidget }) => {
  return (
    <div>
      { isOpen && (
        <Fragment>
          <SelectAllCheckbox allSelected={allSelected} toggleAllImages={toggleAllImages} />
          <GifSizeMenu createGif={createGif} disabled={disabled} />
        </Fragment>
      ) }
      <ToggleButton isOpen={isOpen} toggler={toggleWidget} />
    </div>
  );
};

export default GifGenWidget;
