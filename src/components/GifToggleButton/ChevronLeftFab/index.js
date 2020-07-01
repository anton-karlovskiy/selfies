
import React from 'react';

import FloatingActionButton from 'components/UI/FloatingActionButton';
import './chevron-left-fab.css';

const ChevronLeftFab = ({
  className,
  ...rest
}) => (
  <FloatingActionButton
    {...rest}
    className={`chevron-left-fab ${className}`} />
);

export default ChevronLeftFab;
