
import React from 'react';

import Button from 'components/UI/Button';
import './floating-action-button.css';

const FloatingActionButton = ({
  className,
  loading,
  ...rest
}) => (
  <Button
    {...rest}
    loading={loading}
    style={{opacity: loading ? '.6' : '1'}}
    className={`floating-action-button ${className}`} />
);

export default FloatingActionButton;
