import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';
import Collapse from 'material-ui/transitions/Collapse';

export const styleSheet = theme => ({
  root: {
    marginLeft: 14 + 11,
    paddingLeft: (24 - 11) + 8,
    paddingRight: 16,
    overflow: 'hidden',
  },
  notLast: {
    borderLeft: `1px solid ${theme.palette.primary[200]}`,
  },
  active: {
    margin: '8px 0px 8px 25px',
  },
});

const StepContent = (props) => {
  const {
    active,
    children,
    completed, // eslint-disable-line no-unused-vars
    last, // eslint-disable-line no-unused-vars
    classes,
  } = props;

  const className = classNames(
    classes.root,
    {
      [classes.notLast]: !last,
      [classes.active]: active,
    },
  );
  return (
    <div className={className}>
      <Collapse
        in={active}
        transitionDuration="auto"
        unmountOnExit
      >
        {children}
      </Collapse>
    </div>
  );
};


StepContent.propTypes = {
  /**
   * Expands the content
   */
  active: PropTypes.bool,
  /**
   * Step content
   */
  children: PropTypes.node,
  /**
   * @ignore
   */
  completed: PropTypes.bool,
  /**
   * @ignore
   */
  last: PropTypes.bool,
  classes: PropTypes.object,
};

StepContent.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  stepper: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'StepContent' })(StepContent);
