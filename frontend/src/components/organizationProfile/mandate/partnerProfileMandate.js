import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../../customStepper'
import PartnerProfileMandate1 from "./partnerProfileMandate1";
import PartnerProfileMandate2 from "./partnerProfileMandate2";
import PartnerProfileMandate3 from "./partnerProfileMandate3";
import PartnerProfileMandate4 from "./partnerProfileMandate4";
import PartnerProfileMandate5 from "./partnerProfileMandate5";
import PartnerProfileMandate6 from "./partnerProfileMandate6";
import PartnerProfileMandate7 from "./partnerProfileMandate7";
import PartnerProfileStepper from '../partnerProfileStepper'


class PartnerProfileMandate extends React.Component {

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
        <Stepper linear='false' activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>Background</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} first>
                <PartnerProfileMandate1 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Governance</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileMandate2 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Ethics</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileMandate3 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Experience</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileMandate4 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Population of Concern</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileMandate5 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Country Presence</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileMandate6 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Security</StepLabel>
            <StepContent>
              <PartnerProfileStepper onSubmit={this.handleNext} handlePrev={this.handlePrev}>
                <PartnerProfileMandate7 />
              </PartnerProfileStepper>
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileMandate);