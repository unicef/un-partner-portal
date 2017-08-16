import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileCollaborationHistory from "./partnerProfileCollaborationHistory";
import PartnerProfileCollaborationAccreditation from "./partnerProfileCollaborationAccreditation";
import PartnerProfileCollaborationReferences from "./partnerProfileCollaborationReferences";
import PartnerProfileStepper from '../partnerProfileStepper'

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: "100%", 
    padding: '1em 1em 3em'
  }
}));

const STEPS = [
  {
    component: <PartnerProfileCollaborationHistory />,
    label: 'History of Partnership'
  },
  {
    component: <PartnerProfileCollaborationAccreditation />,
    label: 'Accreditation (optional)'
  },
  {
    component: <PartnerProfileCollaborationReferences />,
    label: 'References (optional)'
  }
]

class PartnerProfileCollaboration extends React.Component {

  constructor(props) {
    super()
    this.state = {
      stepIndex: 0,
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
export default withStyles()(PartnerProfileCollaboration);