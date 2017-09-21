
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
}));

const WithGreyColor = Component => withStyles(styleSheet)(
  ({ classes, ...props }) => <Component className={classes.grey} {...props} />,
);


WithGreyColor.propTypes = {
  classes: PropTypes.object,
  component: PropTypes.component,
};

export default WithGreyColor;
