
import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles, createStyleSheet } from 'material-ui/styles';

const styleSheet = createStyleSheet('Loader', () => ({
  root: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  spinner: {
    position: 'absolute',
    left: 'calc(50% - 25px)',
    top: 'calc(50% - 25px)',
  },
}));

const Loader = (props) => {
  const { classes, children, loading } = props;
  return (
    <div className={loading && classes.root}>
      {loading && <CircularProgress
        className={classes.spinner}
        color="accent"
        size={50}
      />}
      {children}
    </div>
  );
};

Loader.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element,
  loading: PropTypes.bool,
};


export default withStyles(styleSheet)(Loader);
