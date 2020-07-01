
import React from 'react';

import FloatingActionButton from 'components/UI/FloatingActionButton';
import './chevron-right-fab.css';

const ChevronRightFab = ({
  className,
  ...rest
}) => (
  <FloatingActionButton
    {...rest}
    className={`chevron-right-fab ${className}`} />
);

export default ChevronRightFab;
