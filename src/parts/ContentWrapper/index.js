
import React from 'react';

import './content-wrapper.css';

const ContentWrapper = ({
  className,
  children,
  ...rest
}) => (
  <div
    {...rest}
    className={`content-wrapper ${className}`}>
    {children}
  </div>
);

export default ContentWrapper;
