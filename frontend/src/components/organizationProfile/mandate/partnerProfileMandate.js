import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileMandateBackground from "./partnerProfileMandateBackground";
import PartnerProfileMandateGovernance from "./partnerProfileMandateGovernance";
import PartnerProfileMandateEthics from "./partnerProfileMandateEthics";
import PartnerProfileMandateExperience from "./partnerProfileMandateExperience";
import PartnerProfileMandatePopulation from "./partnerProfileMandatePopulation";
import PartnerProfileMandateCountryPresence from "./partnerProfileMandateCountryPresence";
import PartnerProfileMandateSecurity from "./partnerProfileMandateSecurity";
import PartnerProfileStepper from '../partnerProfileStepper'

const STEPS = [
  {
    component: <PartnerProfileMandateBackground />,
    label: 'Background'
  },
  {
    component: <PartnerProfileMandateGovernance />,
    label: 'Governance'
  },
  {
    component: <PartnerProfileMandateEthics />,
    label: 'Ethics'
  },
  {
    component: <PartnerProfileMandateExperience />,
    label: 'Experience'
  },
  {
    component: <PartnerProfileMandatePopulation />,
    label: 'Population of Concern'
  },
  {
    component: <PartnerProfileMandateCountryPresence />,
    label: 'Country Presence'
  },
  {
    component: <PartnerProfileMandateSecurity />,
    label: 'Security'
  }
]

class PartnerProfileMandate extends React.Component {

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
export default withStyles()(PartnerProfileMandate);