import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styleSheet = () => ({
  caption: {
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    lineHeight: '1.375em',
    color: 'rgba(0, 0, 0, 0.54)',
  },
});

const CaptionTypography = (props) => {
  const { classes, children } = props;
  return (
    <Typography className={classes.caption}>{children}</Typography>
  );
};

CaptionTypography.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'CaptionTypography' })(CaptionTypography);
