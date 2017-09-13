import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styleSheet = createStyleSheet('IconWithText', () => ({
  base: {
    display: 'flex',
    width: '100',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: 'inherit',
  },
  text: {
    marginLeft: 8,
  },
}));

const IconWithText = (props) => {
  const { classes, icon, text } = props;
  return (
    <div
      className={classes.base}
    >
      {icon}
      <Typography className={classes.text} color="inherit" >{text}</Typography>
    </div>
  );
};

IconWithText.propTypes = {
  classes: PropTypes.object,
  icon: PropTypes.component,
  text: PropTypes.string,
};

export default withStyles(styleSheet)(IconWithText);
