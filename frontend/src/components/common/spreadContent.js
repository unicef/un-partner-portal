import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import ClassName from 'classnames';

const styleSheet = () => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
});

const SpreadContent = (props) => {
  const { classes, children, notFullWidth, className: classNameProp } = props;
  const className = ClassName(
    classes.container,
    { [classes.fullWidth]: !notFullWidth },
    classNameProp,
  );
  return (
    <div className={className} >
      {children}
    </div>
  );
};

SpreadContent.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  notFullWidth: PropTypes.bool,
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default withStyles(styleSheet, { name: 'SpreadContent' })(SpreadContent);
