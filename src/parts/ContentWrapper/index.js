
// ray test touch <
import React from 'react';

import './content-wrapper.css';

const ContentWrapper = ({
  className,
  children
}) => (
  <div className={`content-wrapper ${className}`}>{children}</div>
);

export default ContentWrapper;
// ray test touch >
