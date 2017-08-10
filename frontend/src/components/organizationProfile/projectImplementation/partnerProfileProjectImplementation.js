import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../../customStepper'
import PartnerProfileProjectImplementation1 from "./partnerProfileProjectImplementation1";
import PartnerProfileProjectImplementation2 from "./partnerProfileProjectImplementation2";
import PartnerProfileProjectImplementation3 from "./partnerProfileProjectImplementation3";
import PartnerProfileProjectImplementation4 from "./partnerProfileProjectImplementation4";
import PartnerProfileProjectImplementation5 from "./partnerProfileProjectImplementation5";
import PartnerProfileProjectImplementation6 from "./partnerProfileProjectImplementation6";
import PartnerProfileStepper from '../partnerProfileStepper'

class PartnerProfileProjectImplementation extends React.Component {

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
            <StepLabel>Programme Management</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} first>
                <PartnerProfileProjectImplementation1 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Financial Controls</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileProjectImplementation2 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Internal Controls</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileProjectImplementation3 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Banking Information</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                  <PartnerProfileProjectImplementation4 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Audit & Assessments</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileProjectImplementation5 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Reporting</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileProjectImplementation6 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileProjectImplementation);