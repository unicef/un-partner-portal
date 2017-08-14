import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../../customStepper'
import PartnerProfileFunding1 from "./partnerProfileFunding1";
import PartnerProfileFunding2 from "./partnerProfileFunding2";
import PartnerProfileStepper from '../partnerProfileStepper'


class PartnerProfileFunding extends React.Component {

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
              <StepLabel>Budget</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileFunding1 />
              </div>
            </Step>
            <Step>
              <StepLabel>Major Donors</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileFunding2 />
              </div>
            </Step>
          </Stepper>
        </PartnerProfileStepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileFunding);