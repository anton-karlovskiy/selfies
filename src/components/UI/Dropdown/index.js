
import React, { useState } from 'react';

import DropButton from './DropButton';
import DropdownContent from './DropdownContent';
import './dropdown.css';

const Dropdown = ({ listItems }) => {
  const [open, setOpen] = useState(false);

  const openHandler = () => {
    setOpen(prevState => !prevState);
  };

  const closeHandler = () => {
    setOpen(false);
  };

  return (
    <div className='dropdown'>
      <DropButton
        className='mui-box-shadow mui-border-radius'
        onClick={openHandler}>
        Dropdown
      </DropButton>
      {/* TODO: click away listener needed */}
      <DropdownContent
        className={open ? 'show' : ''}
        listItems={listItems}
        close={closeHandler} />
    </div>
  );
};

export default Dropdown;
