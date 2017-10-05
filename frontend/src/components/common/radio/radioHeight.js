import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Radio from 'material-ui/Radio';

export const styleSheet = () => ({
  rootRadio: {
    height: '100%',
  },
});

const RadioHeight = (props) => {
  const { classes, ...other } = props;

  return (<Radio
    {...other}
    classes={{ root: classes.rootRadio }}
  />);
};

RadioHeight.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'RadioHeight' })(RadioHeight);

