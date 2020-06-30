
import React from 'react';

import Checkbox from 'components/UI/Checkbox';

const SelectAllCheckbox = ({
  checked,
  onChange
}) => (
  <Checkbox
    label='Select All'
    checked={checked}
    onChange={onChange} />
);

export default SelectAllCheckbox;
