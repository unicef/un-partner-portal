import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
} from '../customStepper'
import PartnerProfileMandate1 from "./PartnerProfileMandate1";
import PartnerProfileMandate2 from "./PartnerProfileMandate2";
import PartnerProfileMandate3 from "./PartnerProfileMandate3";
import PartnerProfileMandate4 from "./PartnerProfileMandate4";
import PartnerProfileMandate5 from "./PartnerProfileMandate5";
import PartnerProfileMandate6 from "./PartnerProfileMandate6";
import PartnerProfileMandate7 from "./PartnerProfileMandate7";
import PartnerProfileStepper from '../../registration/partnerProfileStepper'


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
          <Stepper linear activeStep={stepIndex} orientation="vertical">
            <Step>
              <StepLabel>Background</StepLabel>
              <StepContent>
                <PartnerProfileMandate1 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Governance</StepLabel>
              <StepContent>
                <PartnerProfileMandate2 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Ethics</StepLabel>
              <StepContent>
                <PartnerProfileMandate3 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Experience</StepLabel>
              <StepContent>
                <PartnerProfileMandate4 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Population of Concern</StepLabel>
              <StepContent>
                <PartnerProfileMandate5 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Country Presence</StepLabel>
              <StepContent>
                <PartnerProfileMandate6 />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Security</StepLabel>
              <StepContent>
                <PartnerProfileMandate7 />
              </StepContent>
            </Step>
          </Stepper>
        </PartnerProfileStepper>
      </div>
    );
  }
}
export default withStyles()(PartnerProfileMandate);