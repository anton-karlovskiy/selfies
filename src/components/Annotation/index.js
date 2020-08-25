
import React from 'react';

import PALETTE_TYPES from 'utils/constants/palette-types';

const Annotation = ({
  color,
  align,
  style,
  text,
  ...rest
}) => {
  switch (color) {
    case PALETTE_TYPES.ERROR:
      color = 'var(--palette-error-main)';
      break;
    case PALETTE_TYPES.INFO:
      color = 'var(--palette-info-main)';
      break;
    default:
      color = 'var(--palette-primary-main)';
      break;
  }

  return (
    <p
      {...rest}
      style={{
        ...style,
        color,
        textAlign: align
      }}>
      {text}
    </p>
  );
};

export default Annotation;
