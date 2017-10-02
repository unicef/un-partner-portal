import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styleSheet = () => ({
  container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

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

export default withStyles(styleSheet, { name: 'SpreadContent' })(SpreadContent);
