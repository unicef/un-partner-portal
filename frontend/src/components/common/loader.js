
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';

const styleSheet = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  Fullscreen: {
    position: 'fixed',
    backgroundColor: theme.palette.common.lightBlack,
    top: 0,
    left: 0,
    zIndex: 1,
  },
  spinner: {
    position: 'absolute',
    left: 'calc(50% - 25px)',
    top: 'calc(50% - 25px)',
  },
});

const Loader = (props) => {
  const { classes, children, loading, fullscreen, replaceContent } = props;
  const className = classNames({
    [classes.root]: loading,
    [classes.Fullscreen]: fullscreen,
  });
  if (replaceContent) {
    return loading ? <div className={className}>
      <CircularProgress
        className={classes.spinner}
        color="accent"
        size={50}
      />
    </div>
      : children;
  }
  return (
    <div className={className}>
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
  fullscreen: PropTypes.bool,
  replaceContent: PropTypes.bool,
};


export default withStyles(styleSheet, { name: 'Loader' })(Loader);
