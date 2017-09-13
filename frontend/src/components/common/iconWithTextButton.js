import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import BaseButton from 'material-ui/internal/ButtonBase';


const styleSheet = createStyleSheet('IconWithTextButton', () => ({
  base: {
    padding: 8,
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: 'inherit',
  },
  text: {
    marginLeft: 8,
  },
}));

const IconWithTextButton = (props) => {
  const { classes, onClick, icon, text } = props;
  return (
    <BaseButton
      className={classes.base}
      aria-label={text}
      onClick={onClick}
      disableRipple
    >
      {icon}
      <Typography className={classes.text} color="inherit" >{text}</Typography>
    </BaseButton>
  );
};

IconWithTextButton.propTypes = {
  classes: PropTypes.object,
  onClick: PropTypes.function,
  icon: PropTypes.component,
  text: PropTypes.string,
};

export default withStyles(styleSheet)(IconWithTextButton);
