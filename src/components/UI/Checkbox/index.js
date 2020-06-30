
import React from 'react';

import './checkbox.css';

const Checkbox = ({
  label,
  checked,
  ...rest
}) => (
  <label className='container'>{label}
    <input
      {...rest}
      type='checkbox'
      checked={checked} />
    <span className='checkmark'></span>
  </label>
);

export default Checkbox;
