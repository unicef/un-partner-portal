import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import Typography from 'material-ui/Typography';

import StepIcon from './StepIcon';
import TooltipIcon from '../common/tooltipIcon';

export const styleSheet = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
  },
  horizontal: {
    height: 72,
  },
  vertical: {
    height: -64,
  },
  active: {
    fontWeight: 500,
  },
  completed: {

  },
  disabled: {
    cursor: 'default',
  },
  icon: {
    color: theme.palette.primary[500],
    display: 'block',
    fontSize: 24,
    width: 24,
    height: 24,
  },
  tooltipIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconContainer: {
    paddingRight: 8,
  },
  errorText: {
    color: theme.palette.error[500],
  },
});

function StepLabel(props) {
  const {
    active,
    completed,
    disabled,
    icon,
    orientation,
    last,
    children,
    error,
    classes,
    infoText,
    ...other
  } = props;

  const className = classNames(
    classes.root,
    {
      [classes.active]: active,
      [classes.disabled]: disabled,
      [classes.completed]: completed,
    },
    classes[orientation],
  );

  return React.Children.count(children) ? (
    <span className={className} {...other}>
      {icon && (
        <span className={classes.iconContainer}>
          <StepIcon
            completed={completed}
            active={active}
            icon={icon}
            disabled={disabled}
          />
        </span>
      )}
      <Typography className={error ? classes.errorText : null} type="body1">{children}</Typography>
      {infoText ? <TooltipIcon
        iconClass={classes.tooltipIcon}
        infoText={infoText}
      />
        : null}
    </span>
  ) : null;
}

StepLabel.propTypes = {
  classes: PropTypes.object,
  /**
   * Sets the step as active. Is passed to child components.
   */
  active: PropTypes.bool,
  /**
   * Should be `StepLabel` sub-components such as `StepLabelLabel`.
   */
  children: PropTypes.node,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * Mark the step as disabled, will also disable the button if
   * `StepLabelButton` is a child of `StepLabel`. Is passed to child components.
   */
  disabled: PropTypes.bool,
  /**
   * The icon displayed by the step label.
   */
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.number,
  ]),
  /**
   * @ignore
   */
  last: PropTypes.bool,
  /**
   * @ignore
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  /**
   * whether label should be displayed in error state
   */
  error: PropTypes.bool,
  /**
   * text/component for tooltip
   */
  infoText: PropTypes.node,
};

export default withStyles(styleSheet, { name: 'StepLabel' })(StepLabel);
