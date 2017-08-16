import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileFundingBudget from "./partnerProfileFundingBudget";
import PartnerProfileFundingDonors from "./partnerProfileFundingDonors";
import PartnerProfileStepper from '../partnerProfileStepper'

const STEPS = [
  {
    component: <PartnerProfileFundingBudget />,
    label: 'Budget'
  },
  {
    component: <PartnerProfileFundingDonors />,
    label: 'Major Donors'
  }
]

class PartnerProfileFunding extends React.Component {

  constructor(props) {
    super()
    this.state = {
      stepIndex: 0,
      lastStep: 4
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
    });
  };

  render() {
    const { stepIndex } = this.state;
    return (
      <div style={{ maxWidth: "100%", padding: '1em 1em 3em' }}>
        <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
      </div>
    );
  }
}
export default withStyles()(PartnerProfileFunding);