
import React, { Fragment, Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MovieCreation from '@material-ui/icons/MovieCreation';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';

import FabWrapper from '../../../../hoc/FabWrapper';
import config from '../../../../config';

const styles = theme => ({
	popper: {
		zIndex: 500
	},
	menuList: {
		marginTop: 4
  }
});

class GifSizeMenu extends Component {
  state = {
    isOpen: false
  };

  menuClickHandler = () => {
		this.setState(prevState => ({isOpen: !prevState.isOpen}));
	};

	menuCloseHandler = event => {
		if (this.anchorEl.contains(event && event.target)) {
			return;
		}

		this.setState({isOpen: false});
  };

  createGifHandler = width => {
    const { createGif } = this.props;
    createGif(width);
    this.menuCloseHandler();
  };
  
  render () {
    const { isOpen } = this.state;
    const { classes, disabled } = this.props;

    return (
      <Fragment>
        <FabWrapper
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-haspopup='true'
          aria-owns={isOpen ? 'create-gif' : null}
          disabled={disabled}
          color='secondary'
          aria-label='Create GIF'
          onClick={this.menuClickHandler}>
          <MovieCreation />
        </FabWrapper>
        <Popper
          className={classes.popper}
          open={isOpen}
          anchorEl={this.anchorEl}
          transition
          disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id='create-gif'
              style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
              <Paper className={classes.menuList}>
                <ClickAwayListener onClickAway={this.menuCloseHandler}>
                  <MenuList>
                    { config.gifSizes.map((gifSize, index) =>
                      <MenuItem
                        key={index}
                        onClick={() => this.createGifHandler(gifSize.width)}>
                        {gifSize.label}
                      </MenuItem>
                    ) }
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  }
}

export default withStyles(styles)(GifSizeMenu);
