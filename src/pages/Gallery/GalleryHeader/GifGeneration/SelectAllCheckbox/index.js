
import React from 'react';

import Checkbox from 'components/UI/Checkbox';
import useMedia from 'utils/hooks/use-media';

const SelectAllCheckbox = ({
  checked,
  onChange,
  ...rest
}) => {
  // MEMO: 600px must match CSS value
  const isSmallViewport = useMedia('(max-width: 600px)');

  return (
    <Checkbox
      {...rest}
      label={isSmallViewport ? 'All' : 'Select All'}
      checked={checked}
      onChange={onChange} />
  );
};

export default SelectAllCheckbox;
