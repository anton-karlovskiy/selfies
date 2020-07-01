
import React from 'react';

import Button from 'components/UI/Button';
import './floating-action-button.css';

const FloatingActionButton = ({
  className,
  ...rest
}) => (
  <Button
    {...rest}
    className={`floating-action-button ${className}`} />
);

export default FloatingActionButton;
