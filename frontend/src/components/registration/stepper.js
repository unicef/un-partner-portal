import React from 'react';
import { Field, reduxForm } from 'redux-form';

import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper'
import OrganizationType from "./organizationType";
import getTheme from '../../styles/muiTheme';

const validate = values => {
  const errors = {}
  if (!values.organizationType) {
    errors.organizationType = 'Required'
  }
  if (values.organizationType === 'ingo' && !values.office) {
    errors.office = 'Required'
  }
  return errors
}

class RegistrationStepper extends React.Component {

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

  handleNext(valid) {
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

  renderStepActions(step, valid) {
    const { stepIndex, lastStep } = this.state;
    return (
      <div style={{ margin: '12px 0' }}>
        {(stepIndex !== this.state.lastStep)
          ? (
            <Button
              color='accent'
              raised={true}
              disabled={!valid}
              onTouchTap={valid? this.handleNext: null}>
              {'Continue'}
            </Button>)
          : (
            <Button
              color='accent'
              raised={true}
              onTouchTap={this.props.handleSubmit}>
              {'Submit'}
            </Button>)
        }
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
    const { handleSubmit, valid } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ maxWidth: "100%", padding: '1em 1em 3em' }}>
          <Stepper linear activeStep={stepIndex} orientation="vertical">
            <Step>
              <StepLabel>Select type of your organization</StepLabel>
              <StepContent>
                <OrganizationType />
                {this.renderStepActions(0, valid)}
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
      </form>
    );
  }
}
export default reduxForm({
  form: 'registration',
  validate,               
  onSubmit: (values) => console.log(values)
})(withStyles()(RegistrationStepper));