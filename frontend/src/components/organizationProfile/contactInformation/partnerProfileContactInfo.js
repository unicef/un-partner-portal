import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../../customStepper'
import PartnerProfileContactInfo1 from "./partnerProfileContactInfo1";
import PartnerProfileContactInfo2 from "./partnerProfileContactInfo2";
import PartnerProfileContactInfo3 from "./partnerProfileContactInfo3";
import PartnerProfileContactInfo4 from "./partnerProfileContactInfo4";
import PartnerProfileStepper from '../partnerProfileStepper'


class PartnerProfileContactInfo extends React.Component {

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
                <StepLabel>Mode of Communication</StepLabel>
                <div style={{ maxWidth: "100%", padding: '1em 3em 3em', backgroundColor: 'rgba(52,52,52,alpha)' }}>
                  <PartnerProfileContactInfo1 />
                </div>
              </Step>
              <Step>
                <StepLabel>Mailing Address</StepLabel>
                <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                  <PartnerProfileContactInfo2 />
                </div>
              </Step>
              <Step>
                <StepLabel>Authorised Officials</StepLabel>
                <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                  <PartnerProfileContactInfo3 />
                </div>
              </Step>
              <Step>
                <StepLabel>Working Languages</StepLabel>
                <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                  <PartnerProfileContactInfo4 />
                </div>
              </Step>
          </Stepper>
        </PartnerProfileStepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileContactInfo);