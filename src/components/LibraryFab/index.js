
import React from 'react';

import FloatingActionButton from 'components/UI/FloatingActionButton';
import './library-fab.css';

const LibraryFab = props => (
  <FloatingActionButton
    {...props}
    className='library-fab' />
);

export default LibraryFab;
