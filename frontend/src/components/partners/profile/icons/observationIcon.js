import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Comment from 'material-ui-icons/Comment';

const styleSheet = (theme) => {
  const paddingIcon = theme.spacing.unit;
  return {
    icon: {
      width: 20,
      height: 20,
      margin: `0 ${paddingIcon}px 0 0`,
      fill: theme.palette.flags.observation,
    },
  };
};

const ObservationIcon = (props) => {
  const { classes } = props;
  return <Comment className={classes.icon} />;
};

ObservationIcon.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'ObservationIcon' })(ObservationIcon);
