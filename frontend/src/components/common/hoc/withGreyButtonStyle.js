
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';


const styleSheet = createStyleSheet('WithGreyColor', theme => ({
  grey: {
    color: theme.palette.primary[700],
    '&:hover': {
      color: theme.palette.primary[900],
    },
  },
  disabled: {
    color: theme.palette.action.disabled,
  },
}));

const WithGreyColor = disabled => Component => withStyles(styleSheet)(
  ({ classes, ...props }) => (<Component
    className={disabled ? classes.disabled : classes.grey}
    disabled={disabled}
    {...props}
  />),
);


WithGreyColor.propTypes = {
  classes: PropTypes.object,
  component: PropTypes.component,
};

export default WithGreyColor;
