
import React, { Fragment } from 'react';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

import FabWrapper from '../../hoc/FabWrapper';

const ToggleButton = ({ isOpen, toggler }) => {
  return (
    <Fragment>
      <FabWrapper color='primary' onClick={toggler}>
        { isOpen ? (
          <ChevronRight fontSize='large' />
        ) : (
          <ChevronLeft fontSize='large' />
        ) }
      </FabWrapper>
    </Fragment>
  );
};

export default ToggleButton;
