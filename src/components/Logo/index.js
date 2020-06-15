
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import logoIcon from '../../assets/images/logo-icon.png';
import PAGES from 'utils/pages';

const styles = theme => ({
  root: {
    display: 'flex',
    justfiyContent: 'center',
    alignItems: 'center'
  },
	logoIcon: {
    width: 56,
		cursor: 'pointer',
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 8,
    paddingRight: 8
  },
  logoText: {
    display: 'none',
    color: '#305879',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    paddingLeft: 8,
    paddingRight: 8,
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    }
  }
});

const Logo = ({ classes, history }) => {
  const navigateToHomeHandler = () => {
		history.push(PAGES.HOME);
  };
  
  return (
    <div className={classes.root}>
      <img
        className={classes.logoIcon}
        src={logoIcon}
        onClick={navigateToHomeHandler}
        alt='Visage' />
      <span className={classes.logoText}>Visage</span>
    </div>
  );
};

export default withStyles(styles)(withRouter(Logo));
