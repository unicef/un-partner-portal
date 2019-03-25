import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const messages = {
  match: 'POTENTIAL MATCH',
}

const styleSheet = theme => ({
  flagBg: {
    padding: '2px 10px 2px 10px',
    background: theme.palette.flags.background,
  },
});

const PotentialMatch = (props) => {
  const { classes } = props;

  return <Typography type="body2" className={classes.flagBg}>{messages.match}</Typography>;
};

PotentialMatch.propTypes = {
  verified: PropTypes.bool,
  classes: PropTypes.object,
  small: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'PotentialMatch' })(PotentialMatch);
