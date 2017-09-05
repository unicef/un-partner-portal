import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('PaddedHeader', (theme) => {
  const padding = theme.spacing.unit;
  return {
    container: {
      padding: `${padding}px ${padding}px`,
    },
  };
});

const PaddedHeader = (props) => {
  const { classes, children } = props;
  return (
    <div className={classes.container} >
      {children}
    </div>
  );
};

PaddedHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withStyles(styleSheet)(PaddedHeader);
