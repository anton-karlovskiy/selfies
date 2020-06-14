
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
	progressBarColor: {
		backgroundColor: '#00ff00'
	}
});

const ProgressBar = ({ classes }) => (
  <LinearProgress className={classes.progressBarColor} />
);

export default withStyles(styles)(ProgressBar);
