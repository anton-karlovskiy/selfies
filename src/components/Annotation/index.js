
// ray test touch <
import React from 'react';

import './annotation.css';

const Annotation = ({
  className,
  text,
  ...rest
}) => (
  <p
    {...rest}
    className={`annotation ${className}`}>
    {text}
  </p>
);

export default Annotation;
// ray test touch >
