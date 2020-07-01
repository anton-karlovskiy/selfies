
import React from 'react';

import DropdownContentItem from './DropdownContentItem';
import './dropdown-content.css';

const DropdownContent = ({
  className,
  listItems,
  closeDropdownContent
}) => (
  <ul className={`dropdown-content ${className}`}>
    {listItems.map(listItem => (
      <DropdownContentItem
        key={listItem.id}
        label={listItem.label}
        closeDropdownContent={closeDropdownContent}
        onClick={listItem.onClick} />
    ))}
  </ul>
);

export default DropdownContent;
