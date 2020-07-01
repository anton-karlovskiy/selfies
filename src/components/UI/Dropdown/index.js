
import React, { useState, useRef } from 'react';

import DropButton from './DropButton';
import DropdownContent from './DropdownContent';
import useClickAway from 'utils/hooks/use-click-away';
import './dropdown.css';

const Dropdown = ({
  listItems,
  loading,
  disabled
}) => {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  useClickAway(ref, () => {
    closeDropdownContentHandler();
  });

  const toggleDropdownContentHandler = () => {
    setOpen(prevState => !prevState);
  };

  const closeDropdownContentHandler = () => {
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className='dropdown'>
      <DropButton
        disabled={disabled}
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
