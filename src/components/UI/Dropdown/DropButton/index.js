
import React from 'react';

import './drop-button.css';

const DropButton = ({
  className,
  children,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`drop-button ${className}`}>
    {children}
  </button>
);

export default DropButton;
