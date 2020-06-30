
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
    <li
      className='dropdown-content-item'
      onClick={onClickHandler}>
      {label}
    </li>
  );
};

export default DropdownContentItem;
