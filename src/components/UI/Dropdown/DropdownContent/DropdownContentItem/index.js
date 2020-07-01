
import React from 'react';

import './dropdown-content-item.css';

const DropdownContentItem = ({
  label,
  onClick,
  closeDropdownContent
}) => {
  const onClickHandler = () => {
    onClick();
    closeDropdownContent();
  };
  
  return (
    <li
      className='dropdown-content-item'
      onClick={onClickHandler}>
      {label}
    </li>
  );
};

export default DropdownContentItem;
