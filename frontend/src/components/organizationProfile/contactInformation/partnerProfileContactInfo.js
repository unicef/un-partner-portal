import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import PartnerProfileContactInfoMode from "./partnerProfileContactInfoMode";
import PartnerProfileContactInfoAddress from "./partnerProfileContactInfoAddress";
import PartnerProfileContactInfoOfficials from "./partnerProfileContactInfoOfficials";
import PartnerProfileContactInfoLanguages from "./partnerProfileContactInfoLanguages";
import PartnerProfileStepper from '../partnerProfileStepper'

const STEPS = [
  {
    component: <PartnerProfileContactInfoMode />,
    label: 'History of Partnership'
  },
  {
    component: <PartnerProfileContactInfoAddress />,
    label: 'Accreditation (optional)'
  },
  {
    component: <PartnerProfileContactInfoOfficials />,
    label: 'References (optional)'
  },
  {
    component: <PartnerProfileContactInfoLanguages />,
    label: 'References (optional)'
  }
]

class PartnerProfileContactInfo extends React.Component {

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
export default withStyles()(PartnerProfileContactInfo);