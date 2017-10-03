import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';

export const styleSheet = theme => ({
  root: {
    flex: '1 1 auto',
  },
  line: {
    display: 'block',
    borderColor: theme.palette.primary[200],
  },
  hidden: {
    display: 'none',
    height: 0,
  },
  rootVertical: {
    marginLeft: 11, // padding + 1/2 icon
  },
  lineHorizontal: {
    marginLeft: -6,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
  },
  lineVertical: {
    borderLeftStyle: 'solid',
    borderLeftWidth: 1,
    margin: '8px 0px',
    minHeight: 40,
  },
});

function StepConnector(props) {
  const {
    className: classNameProp,
    classes,
    orientation,
    active,
    ...other
  } = props;

  const className = classNames(
    classes.root,
    {
      [classes.rootVertical]: orientation === 'vertical',
      [classes.hidden]: active,
    },
    classNameProp,
  );
  const lineClassName = classNames(
    classes.line,
    {
      [classes.lineHorizontal]: orientation === 'horizontal',
      [classes.lineVertical]: orientation === 'vertical',
      [classes.hidden]: active,
    },
  );

  return (
    <div className={className} {...other}>
      <span className={lineClassName} />
    </div>
  );
}

StepConnector.propTypes = {
  /**
   * Useful to extend the style applied to the component.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  active: PropTypes.bool,
};

export default withStyles(styleSheet, { name: 'StepConnector' })(StepConnector);
