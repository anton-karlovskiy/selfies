
import React from 'react';

import ChevronLeftFab from './ChevronLeftFab';
import ChevronRightFab from './ChevronRightFab';

const ToggleButton = ({
  open,
  onClick
}) => (
  <>
    {open ? (
      <ChevronRightFab onClick={onClick} />
    ) : (
      <ChevronLeftFab onClick={onClick} />
    )}
  </>
);

export default ToggleButton;
