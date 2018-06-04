import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import BaseButton from 'material-ui/ButtonBase';


const styleSheet = () => ({
  base: {
    padding: 8,
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'baseline',
    backgroundColor: 'transparent',
    color: 'inherit',
  },
  text: {
    marginLeft: 8,
  },
});

const IconWithTextButton = (props) => {
  const { classes, onClick, icon, text, textProps } = props;
  return (
    <BaseButton
      className={classes.base}
      aria-label={text}
      onClick={onClick}
      disableRipple
    >
      {icon}
      <Typography className={classes.text} color="inherit" {...textProps}>{text}</Typography>
    </BaseButton>
  );
};

IconWithTextButton.propTypes = {
  classes: PropTypes.object,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  text: PropTypes.string,
  textProps: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'IconWithTextButton' })(IconWithTextButton);
