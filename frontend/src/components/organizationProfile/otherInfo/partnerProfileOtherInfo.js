import React from 'react';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileOtherInfoContent from "./partnerProfileOtherInfoContent";
import PartnerProfileStepper from '../partnerProfileStepper'

const STEPS = [
  {
    component: <PartnerProfileOtherInfoContent />,
    label: ''
  }
]

class PartnerProfileOtherInfo extends React.Component {

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
        <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
      </div>
    );
  }
}
export default withStyles()(PartnerProfileOtherInfo);