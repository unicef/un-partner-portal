import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileProjectImplementationManagement from "./partnerProfileProjectImplementationManagement";
import PartnerProfileProjectImplementationFinancialControls from "./partnerProfileProjectImplementationFinancialControls";
import PartnerProfileProjectImplementationInternalControls from "./partnerProfileProjectImplementationInternalControls";
import PartnerProfileProjectImplementationBankingInfo from "./partnerProfileProjectImplementationBankingInfo";
import PartnerProfileProjectImplementationAudit from "./partnerProfileProjectImplementationAudit";
import PartnerProfileProjectImplementationReporting from "./partnerProfileProjectImplementationReporting";
import PartnerProfileStepper from '../partnerProfileStepper'

const STEPS = [
  {
    component: <PartnerProfileProjectImplementationManagement />,
    label: 'Programme Management'
  },
  {
    component: <PartnerProfileProjectImplementationFinancialControls />,
    label: 'Financial Controls'
  },
  {
    component: <PartnerProfileProjectImplementationInternalControls />,
    label: 'Internal Controls'
  },
  {
    component: <PartnerProfileProjectImplementationBankingInfo />,
    label: 'Banking Information'
  },
  {
    component: <PartnerProfileProjectImplementationAudit />,
    label: 'Audit & Assessments'
  },
  {
    component: <PartnerProfileProjectImplementationReporting />,
    label: 'Reporting'
  }
]

class PartnerProfileProjectImplementation extends React.Component {

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
export default withStyles()(PartnerProfileProjectImplementation);