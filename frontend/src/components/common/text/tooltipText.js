import Typography from 'material-ui/Typography';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  text: {
    whiteSpace: 'pre-line',
    color: theme.palette.primary[400],
    fontSize: 12,
  },
});

const TooltipText = (props) => {
  const { classes, children, ...other } = props;
  return (
    <Typography className={classes.text} {...other}>
      {children}
    </Typography>
  );
};

TooltipText.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'TooltipText' })(TooltipText);
