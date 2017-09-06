import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('PaddedContent', (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    container: {
      padding: `${padding}px ${padding}px`,
    },
  };
});

const PaddedContent = (props) => {
  const { classes, children } = props;
  return (
    <div className={classes.container} >
      {children}
    </div>
  );
};

PaddedContent.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withStyles(styleSheet)(PaddedContent);
