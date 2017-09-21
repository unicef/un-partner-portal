import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('SpreadContent', () => ({
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const SpreadContent = (props) => {
  const { classes, children } = props;
  return (
    <div className={classes.container} >
      {children}
    </div>
  );
};

SpreadContent.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withStyles(styleSheet)(SpreadContent);
