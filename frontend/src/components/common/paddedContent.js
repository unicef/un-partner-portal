import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = (theme) => {
  const padding = theme.spacing.unit * 2;
  const paddingBig = theme.spacing.unit * 3;

  return {
    container: {
      padding: `${padding}px ${padding}px`,
    },
    containerBig: {
      padding: `${paddingBig}px ${paddingBig}px`,
    },
  };
};

const PaddedContent = (props) => {
  const { classes, children, big } = props;
  return (
    <div className={big ? classes.containerBig : classes.container} >
      {children}
    </div>
  );
};

PaddedContent.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  big: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'PaddedContent' })(PaddedContent);
