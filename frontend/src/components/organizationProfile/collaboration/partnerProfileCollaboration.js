import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../../customStepper'

import PartnerProfileCollaboration1 from "./partnerProfileCollaboration1";
import PartnerProfileCollaboration2 from "./partnerProfileCollaboration2";
import PartnerProfileCollaboration3 from "./partnerProfileCollaboration3";
import PartnerProfileStepper from '../partnerProfileStepper'

class PartnerProfileCollaboration extends React.Component {

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
        <PartnerProfileStepper onSubmit={this.handleNext} first>
        <Stepper linear activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel>History of Partnership</StepLabel>
            <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileCollaboration1 />
            </div>
          </Step>
          <Step>
            <StepLabel>Accreditation (optional)</StepLabel>
            <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileCollaboration2 />
            </div>
          </Step>
          <Step>
            <StepLabel>References (optional)</StepLabel>
            <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileCollaboration3 />
            </div>
          </Step>
        </Stepper>
        </PartnerProfileStepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileCollaboration);