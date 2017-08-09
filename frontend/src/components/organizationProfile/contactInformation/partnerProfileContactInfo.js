import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper'
import PartnerProfileContactInfo1 from "./PartnerProfileContactInfo1";
import PartnerProfileContactInfo2 from "./PartnerProfileContactInfo2";
import PartnerProfileContactInfo3 from "./PartnerProfileContactInfo3";
import PartnerProfileContactInfo4 from "./PartnerProfileContactInfo4";
import PartnerProfileStepper from '../../registration/partnerProfileStepper'


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
              <StepContent>
                <PartnerProfileContactInfo1 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Mailing Address</StepLabel>
              <StepContent>
                <PartnerProfileContactInfo2 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Authorised Officials</StepLabel>
              <StepContent>
                <PartnerProfileContactInfo3 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Working Languages</StepLabel>
              <StepContent>
                <PartnerProfileContactInfo4 />
              </StepContent>
            </Step>
          </Stepper>
        </PartnerProfileStepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileContactInfo);