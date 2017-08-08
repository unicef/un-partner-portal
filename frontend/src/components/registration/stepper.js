import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper'
import OrganizationType from "./organizationType";
import BasicInformation from "./basicInformation";
import RegistrationStep from './registrationStep'


class RegistrationStepper extends React.Component {

  constructor(props) {
    super()
    this.state = {
      stepIndex: 0,
      lastStep: 4
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  handleNext() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  };

  handlePrev() {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };


  render() {
    const { stepIndex } = this.state;
    return (
      <div style={{ maxWidth: "100%", padding: '1em 1em 3em' }}>
        <Stepper linear activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Select type of your organization</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} first>
                <OrganizationType />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Enter basic information</StepLabel>
            <StepContent>
              <RegistrationStep onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <BasicInformation />
              </RegistrationStep>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Fill the Harmonized Due Dilligence Declaration</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
              
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Provide e-mail and create password</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
  
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Complete the process</StepLabel>
            <StepContent>
              <p>Lorem ipsum</p>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
export default withStyles()(RegistrationStepper);