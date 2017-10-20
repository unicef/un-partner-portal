import React, { Component } from 'react';
import { withRouter } from 'react-router';
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

    this.onNextClick = this.onNextClick.bind(this);
  }

  onNextClick(formValues) {
    const { initialValues, updateTab, partnerId,
      changeTab, loadPartnerProfileDetails } = this.props;

    const funding = flatten(formValues.fund);
    const initFunding = flatten(initialValues.fund);

    return updateTab(partnerId, 'funding', changedValues(initFunding, funding))
      .then(() => loadPartnerProfileDetails(partnerId).then(() => changeTab()))
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
      onSubmit={this.onNextClick}
      onNextClick={this.onNextClick}
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

