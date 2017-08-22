import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Paper from 'material-ui/Paper';


const styleSheet = createStyleSheet('MainContentWrapper', theme => ({
  root: {
    background: theme.palette.primary[200],
    padding: theme.spacing.unit * 3,
  },
}));

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

export default withStyles(styleSheet)(MainContentWrapper);
