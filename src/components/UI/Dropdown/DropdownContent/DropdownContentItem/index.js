
import React from 'react';

import './dropdown-content-item.css';

const DropdownContentItem = ({
  label,
  onClick,
  close
}) => {
  const onClickHandler = () => {
    onClick();
    close();
  };
  
  return (
    <button
      className='dropdown-content-item'
      onClick={onClickHandler}>
      {label}
    </button>
  );
};

export default DropdownContentItem;
