
import React from 'react';

import DropdownContentItem from './DropdownContentItem';
import './dropdown-content.css';

const DropdownContent = ({
  className,
  listItems,
  close
}) => (
  <div className={`dropdown-content ${className}`}>
    {listItems.map(listItem => (
      <DropdownContentItem
        key={listItem.id}
        label={listItem.label}
        close={close}
        onClick={listItem.onClick} />
    ))}
  </div>
);

export default DropdownContent;
