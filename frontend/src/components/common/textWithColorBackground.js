import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';


const styleSheet = (theme) => {
  return {
    margin: {
      padding: `4px ${theme.spacing.unit * 1}px`,
      textAlign: 'center',
    },
    red: {
      backgroundColor: theme.palette.error[800],
      color: theme.palette.getContrastText(theme.palette.error[800]),
    },
  };
};

const TextWithColorBackground = ({ classes, color, text, ...textProps }) => (
  <Typography type="caption" className={`${classes.margin} ${classes[color]}`} {...textProps}> {text} </Typography>
);

TextWithColorBackground.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string,
  text: PropTypes.string,
};

export default withStyles(styleSheet, { name: 'TextWithColorBackground' })(TextWithColorBackground);
