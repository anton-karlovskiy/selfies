
import React from 'react';
import IdealImage from 'react-ideal-image';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  panel: {
    position: 'relative'
  },
  dot: {
    position: 'absolute',
    right: 10,
		top: 10,
    width: 16,
    height: 16,
    borderRadius: '50%',
    backgroundColor: 'green',
		[theme.breakpoints.up('sm')]: {
			top: 20,
			right: 20
		}
  },
  createdDate: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: 'white',
    [theme.breakpoints.up('sm')]: {
			bottom: 20,
			left: 20
		}
  },
  image: {
    backgroundColor: 'grey',
    border: 'solid 4px rgb(151, 151, 151)',
    margin: 4,
    width: 112,
    height: 112,
    borderRadius: 6,
    '& img': {
      objectFit: 'cover',
      width: 112,
      height: '112px !important',
    },
    [theme.breakpoints.up('sm')]: {
      margin: 8,
      width: 200,
			height: 200,
			borderRadius: 8,
      '& img': {
        width: 200,
        height: '200px !important'
			}
    }
  }
});

const Image = ({ classes, onToggle, imageUrl, selectedStatus, dateTime }) => {
  const toggleHandler = () => {
		onToggle && onToggle();
  };
  
  const date = new Date(dateTime);
  const createdDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  return (
    <div className={classes.panel} onClick={toggleHandler}>
      <IdealImage
        className={classes.image}
        width={200}
        height={200}
        placeholder={{color: 'grey'}}
        srcSet={[{width: 100, src: imageUrl}]}
        loader='image' />
      { selectedStatus && (
        <span className={classes.dot} />
      ) }
      <div className={classes.createdDate}>{createdDate}</div>
    </div>
  );
}

export default withStyles(styles)(Image);
