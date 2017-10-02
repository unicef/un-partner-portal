import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';

import StepConnector from './StepConnector';

export const styleSheet = () => ({
  root: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
});

function Stepper(props) {
  const {
    activeStep,
    classes,
    className: classNameProp,
    children,
    connector: connectorProp,
    linear,
    orientation,
    allActive,
    ...other
  } = props;

  const className = classNames(
    classes.root,
    classNameProp,
    classes[orientation],
  );

  const connector = React.cloneElement(connectorProp, { orientation });
  const numChildren = Children.count(children);
  const steps = Children.map(children, (step, index) => {
    const controlProps = {
      index,
      orientation,
    };

    if ((activeStep === index) || allActive) {
      controlProps.active = true;
    } else if (linear && activeStep > index) {
      controlProps.completed = true;
    } else if (linear && activeStep < index) {
      controlProps.disabled = true;
    }

    if (index + 1 === numChildren) {
      controlProps.last = true;
    }
    if (allActive) {
      return [
        React.cloneElement(step, Object.assign(controlProps, step.props)),
      ];
    }

    return [
      ((!allActive && (activeStep + 1 !== index) && (index > 0)) && connector),
      React.cloneElement(step, Object.assign(controlProps, step.props)),
    ];
  });

  return (
    <Paper square elevation={0} className={className} {...other}>
      {steps}
    </Paper>
  );
}

Stepper.propTypes = {
  /**
   * Set the active step (zero based index).
   */
  activeStep: PropTypes.number,
  /**
   * Two or more `<Step />` components.
   */
  children: PropTypes.node,
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * A component to be placed between each step.
   */
  connector: PropTypes.node,
  /**
   * If set to `true`, the `Stepper` will not assist in controlling steps for linear flow
   */
  linear: PropTypes.bool,
  /**
   * The stepper orientation (layout flow direction)
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * If set to `true`, all fields will be active
   */
  allActive: PropTypes.bool,
};

Stepper.defaultProps = {
  activeStep: 0,
  connector: <StepConnector />,
  linear: true,
  orientation: 'horizontal',
  allActive: false,
};

export default withStyles(styleSheet, { name: 'Stepper' })(Stepper);
