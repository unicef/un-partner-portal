import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Radio from 'material-ui/Radio';

export const styleSheet = (theme) => {
  const margin = theme.spacing.unit / 2;

  return {
    rootRadio: {
      height: '100%',
      margin: `${margin}px`,
    },
  };
};

const RadioHeight = (props) => {
  const { classes, ...other } = props;

  return (<Radio
    {...other}
    classes={{ default: classes.rootRadio }}
  />);
};

RadioHeight.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'RadioHeight' })(RadioHeight);

