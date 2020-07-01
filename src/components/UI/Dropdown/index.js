
import React, { useState } from 'react';

import DropButton from './DropButton';
import DropdownContent from './DropdownContent';
import './dropdown.css';

const Dropdown = ({
  listItems,
  loading
}) => {
  const [open, setOpen] = useState(false);

  const toggleDropdownContentHandler = () => {
    setOpen(prevState => !prevState);
  };

  const closeDropdownContentHandler = () => {
    setOpen(false);
  };

  return (
    <div className='dropdown'>
      <DropButton
        loading={loading}
        className='mui-box-shadow mui-border-radius'
        onClick={toggleDropdownContentHandler}>
        GIF
      </DropButton>
      {/* TODO: click away listener needed */}
      <DropdownContent
        className={open ? 'show' : ''}
        listItems={listItems}
        closeDropdownContent={closeDropdownContentHandler} />
    </div>
  );
};

export default Dropdown;
