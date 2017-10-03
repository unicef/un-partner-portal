import R from 'ramda';
import React from 'react';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui';

const styleSheet = () => ({
  relative: {
    position: 'relative',
  },
  loaderBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  loaderIcon: {
    position: 'absolute',
    fontSize: '20px',
    top: 'calc(55% - 10px)',
    left: 'calc(50% - 10px)',
  },
});


const ListLoader = (props) => {
  const { classes, loading, children } = props;

  return (
    <div className={classes.relative}>
      {children}
      {loading && <div className={classes.loaderBg}>
        <CircularProgress color="accent" className={classes.loaderIcon} />
      </div>}
    </div>);
};

ListLoader.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.element,
};

export default withStyles(styleSheet, { name: 'ListLoader' })(ListLoader);
