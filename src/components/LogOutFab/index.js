
import React from 'react';

import FloatingActionButton from 'components/UI/FloatingActionButton';
import './log-out-fab.css';

const LogOutFab = props => (
  <FloatingActionButton
    {...props}
    className='log-out-fab' />
);

export default LogOutFab;
