
import React from 'react';

import Button from 'components/UI/Button';
import './drop-button.css';

const DropButton = ({
  className,
  children,
  onClick
}) => (
  <Button
    onClick={onClick}
    className={`drop-button ${className}`}>
    {children}
  </Button>
);

export default DropButton;
