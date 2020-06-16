
import React from 'react';

import './floating-action-button.css';

const FloatingActionButton = ({
  className,
  ...rest
}) => (
  <button
    {...rest}
    className={`floating-action-button ${className}`} />
);

export default FloatingActionButton;
