
import React from 'react';

import ChevronLeftFab from './ChevronLeftFab';
import ChevronRightFab from './ChevronRightFab';
import './gif-toggle-button.css';

const GifToggleButton = ({
  open,
  ...rest
}) => (
  <>
    {open ? (
      <ChevronRightFab
        {...rest}
        className='gif-toggle-button' />
    ) : (
      <ChevronLeftFab
        {...rest}
        className='gif-toggle-button' />
    )}
  </>
);

export default GifToggleButton;
