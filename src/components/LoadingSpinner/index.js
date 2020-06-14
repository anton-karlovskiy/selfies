
import React from 'react';
import ReactLoading from 'react-loading';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	loadingSpinner: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const LoadingSpinner = ({ classes }) => (
  <div className={classes.loadingSpinner}>
    <ReactLoading
      type='spin'
      color='#ddd' />
  </div>
);

export default withStyles(styles)(LoadingSpinner);
