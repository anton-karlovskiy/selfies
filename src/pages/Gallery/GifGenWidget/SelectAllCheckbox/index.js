
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  selectAll: {
		marginRight: 0
	}
});

const SelectAllCheckbox = ({ classes, allSelected, toggleAllImages }) => (
  <FormControlLabel
    className={classes.selectAll}
    control={ (
      <Checkbox
        checked={allSelected}
        color='primary'
        onChange={toggleAllImages} />
    ) }
    label='Select All' />
);

export default withStyles(styles)(SelectAllCheckbox);
