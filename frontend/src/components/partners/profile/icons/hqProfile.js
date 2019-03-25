import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const messages = {
  hq: 'HQ',
}


const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit / 2;

  return {
    hq: {
      fontSize: '10px',
      marginLeft: `${paddingIcon}px`,
      padding: '0px 6px 0px 6px',
      background: theme.palette.secondary[500],
      color: '#FFF',
    },
  };
};

const HqProfile = (props) => {
  const { classes } = props;

  return <Typography type="body2" className={classes.hq}>{messages.hq}</Typography>;
};

HqProfile.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'HqProfile' })(HqProfile);
