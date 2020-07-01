
import React from 'react';

import Checkbox from 'components/UI/Checkbox';

const SelectAllCheckbox = ({
  checked,
  onChange,
  ...rest
}) => (
  <Checkbox
    {...rest}
    label='Select All'
    checked={checked}
    onChange={onChange} />
);

export default SelectAllCheckbox;
