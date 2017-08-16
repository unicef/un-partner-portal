import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import PartnerProfileIdentificationBasicInfo from "./partnerProfileIdentificationBasicInfo";
import PartnerProfileIdentificationRegistration from "./partnerProfileIdentificationRegistration";
import PartnerProfileStepper from '../partnerProfileStepper'

const STEPS = [
  {
    component: <PartnerProfileIdentificationBasicInfo />,
    label: 'Basic Information'
  },
  {
    component: <PartnerProfileIdentificationRegistration />,
    label: 'Registration of Organization'
  }
]

class PartnerProfileIdentification extends React.Component {

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
export default withStyles()(PartnerProfileIdentification);