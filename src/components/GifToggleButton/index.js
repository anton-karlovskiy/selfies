
import React from 'react';

import ChevronLeftFab from './ChevronLeftFab';
import ChevronRightFab from './ChevronRightFab';
import './gif-toggle-button.css';

const GifToggleButton = ({
  open,
  onClick
}) => (
  <>
    {open ? (
      <ChevronRightFab
        className='gif-toggle-button'
        onClick={onClick} />
    ) : (
      <ChevronLeftFab
        className='gif-toggle-button'
        onClick={onClick} />
    )}
  </>
);

export default GifToggleButton;
