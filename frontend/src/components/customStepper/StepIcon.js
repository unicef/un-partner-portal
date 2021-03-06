import React from 'react';
import PropTypes from 'prop-types';

import CheckCircle from 'material-ui-icons/CheckCircle';
import { withStyles } from 'material-ui/styles';

import StepPositionIcon from './StepPositionIcon';

export const styleSheet = theme => ({
  checkIcon: {
    fill: theme.palette.secondary[500],
  },
});

function StepIcon(props) {
  const { completed, icon, active, disabled, classes, theme } = props;
  const iconType = typeof icon;

  if (iconType === 'number' || iconType === 'string') {
    if (completed) {
      return <CheckCircle color="accent" className={`${classes.root} ${classes.checkIcon}`} />;
    }
    return (
      <StepPositionIcon
        theme={theme}
        position={icon}
        active={active}
        disabled={disabled}
      />
    );
  }

  return icon;
}

StepIcon.propTypes = {
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * The icon displayed by the step label.
   */
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool,
  theme: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(styleSheet, { name: 'StepIcon' })(StepIcon);
