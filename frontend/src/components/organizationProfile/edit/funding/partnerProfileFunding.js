import React, { Component } from 'react';
import { withRouter, browserHistory as history } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileFundingBudget from './partnerProfileFundingBudget';
import PartnerProfileFundingDonors from './partnerProfileFundingDonors';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';


const STEPS = readOnly => [
  {
    component: <PartnerProfileFundingBudget readOnly={readOnly} />,
    label: 'Budget',
    name: 'budgets',
  },
  {
    component: <PartnerProfileFundingDonors readOnly={readOnly} />,
    label: 'Major Donors',
    name: 'major_donors',
  },
];

class PartnerProfileFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionOnSubmit: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleExit = this.handleExit.bind(this);
  }

  onSubmit() {
    const { partnerId, changeTab } = this.props;

    if (this.state.actionOnSubmit === 'next') {
      changeTab();
    } else if (this.state.actionOnSubmit === 'exit') {
      history.push(`/profile/${partnerId}/overview`);
    }
  }

  handleNext() {
    this.setState({ actionOnSubmit: 'next' });
  }

  handleExit() {
    this.setState({ actionOnSubmit: 'exit' });
  }

  handleSubmit(formValues) {
    const { initialValues, updateTab, partnerId, loadPartnerProfileDetails } = this.props;

    const funding = flatten(formValues.fund);
    const initFunding = flatten(initialValues.fund);

    return updateTab(partnerId, 'funding', changedValues(initFunding, funding))
      .then(() => loadPartnerProfileDetails(partnerId).then(() => this.onSubmit()))
      .catch((error) => {
        const errorMsg = error.response.data.non_field_errors || 'Error while saving sections. Please try again.';

        throw new SubmissionError({
          ...error.response.data,
          _error: errorMsg,
        });
      });
  }

  render() {
    const { readOnly } = this.props;
    return (<PartnerProfileStepperContainer
      name="fund"
      handleNext={this.handleNext}
      handleExit={this.handleExit}
      onSubmit={this.handleSubmit}
      steps={STEPS(readOnly)}
      readOnly={readOnly}
    />
    );
  }
}

PartnerProfileFunding.propTypes = {
  readOnly: PropTypes.bool,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  initialValues: PropTypes.object,
  loadPartnerProfileDetails: PropTypes.func,
  changeTab: PropTypes.func,
};

const mapState = (state, ownProps) => ({
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  changeTab: () => dispatch(changeTabToNext()),
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileFunding = connect(mapState, mapDispatch)(PartnerProfileFunding);

export default withRouter(connectedPartnerProfileFunding);

