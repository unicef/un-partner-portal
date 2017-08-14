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
        <PartnerProfileStepper onSubmit={this.handleNext} first>
          <Stepper linear='false' activeStep={stepIndex} orientation="vertical">
            <Step>
              <StepLabel>Background</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate1 />
              </div>
            </Step>
            <Step>
              <StepLabel>Governance</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate2 />
              </div>
            </Step>
            <Step>
              <StepLabel>Ethics</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate3 />
              </div>
            </Step>
            <Step>
              <StepLabel>Experience</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate4 />
              </div>
            </Step>
            <Step>
              <StepLabel>Population of Concern</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate5 />
              </div>
            </Step>
            <Step>
              <StepLabel>Country Presence</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate6 />
              </div>
            </Step>
            <Step>
              <StepLabel>Security</StepLabel>
              <div style={{ maxWidth: "100%", padding: '1em 3em 3em' }}>
                <PartnerProfileMandate7 />
              </div>
            </Step>
          </Stepper>
        </PartnerProfileStepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileMandate);