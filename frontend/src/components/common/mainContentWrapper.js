import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';


const styleSheet = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    background: 'inherit',
  },
});

const MainContentWrapper = (props) => {
  const { classes, children } = props;
  return (
    <Paper elevation={0} className={classes.root}>
      {children}
    </Paper>
  );
};

MainContentWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'MainContentWrapper' })(MainContentWrapper);
