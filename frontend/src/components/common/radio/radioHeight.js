import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Radio from 'material-ui/Radio';

const styleSheet = createStyleSheet('RadioHeight', () => ({
  rootRadio: {
    height: '100%',
  },
}));

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

export default withStyles(styleSheet)(RadioHeight);

