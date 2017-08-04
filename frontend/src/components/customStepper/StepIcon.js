import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import CheckCircle from "material-ui-icons/CheckCircle";
import { withStyles, createStyleSheet } from 'material-ui/styles';
import StepPositionIcon from './StepPositionIcon';

export const styleSheet = createStyleSheet("MuiStepIcon", theme => ({
  root: {
    fill: theme.palette.accent[500],
    display: "block",
  },
  checkIcon: {
    color: 'green',
    display: "block",
    height: '30px',
  },

}));

function StepIcon(props) {
  const { completed, icon, active, classes, theme } = props;
  const iconType = typeof icon;

  if (iconType === "number" || iconType === "string") {
    if (completed) {
      return <CheckCircle color='accent' className={`${classes.root} ${classes.checkIcon}` } />;
    }
    return (
      <StepPositionIcon
        theme={theme}
        classes={classes}
        position={icon}
        active={active}
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
    PropTypes.number
  ]),
};

export default withStyles(styleSheet)(StepIcon);