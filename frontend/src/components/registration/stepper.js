import React from 'react';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper'


import Button from 'material-ui/Button';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import OrganizationType from "./organizationType";

import getTheme from '../../styles/muiTheme';

/**
 * Vertical steppers are designed for narrow screen sizes. They are ideal for mobile.
 *
 * To use the vertical stepper with the contained content as seen in spec examples,
 * you must use the `<StepContent>` component inside the `<Step>`.
 *
 * <small>(The vertical stepper can also be used without `<StepContent>` to display a basic stepper.)</small>
 */
class VerticalLinearStepper extends React.Component {

  constructor(props) {
    super()
    this.state = {
      finished: false,
      stepIndex: 0,
      lastStep: 4
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  handleNext() {
    const { stepIndex, lastStep } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= lastStep,
    });
  };

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  renderStepActions(step) {
    const { stepIndex, lastStep } = this.state;

    return (
      <div style={{ margin: '12px 0' }}>
        <Button
          color='accent'
          raised={true}
          onTouchTap={this.handleNext}>
          {stepIndex === 4 ? 'Submit' : 'Continue'}
        </Button>
        {step > 0 && (
          <Button
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { finished, stepIndex } = this.state;

    return (
      <div style={{ maxWidth: "100%", padding: '1em 1em 3em' }}>
        <Stepper linear activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Select type of your organization</StepLabel>
            <StepContent>
              <OrganizationType />
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Enter basic information</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Fill the Harmonized Due Dilligence Declaration</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Provide e-mail and create password</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
              {this.renderStepActions(3)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Complete the process</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
              {this.renderStepActions(4)}
            </StepContent>
          </Step>
        </Stepper>

      </div>
    );
  }
}

export default withStyles()(VerticalLinearStepper);