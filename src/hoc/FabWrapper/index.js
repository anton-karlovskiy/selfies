
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

const styles = theme => ({
  fab: {
		margin: 8
	}
});

const FabWrapper = ({ classes, children, ...rest }) => (
  <Fab className={classes.fab} {...rest}>
    {children}
  </Fab>
);

export default withStyles(styles)(FabWrapper);
