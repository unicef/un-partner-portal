import R from 'ramda';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { getFormInitialValues, SubmissionError } from 'redux-form';
import PartnerProfileProjectImplementationManagement from './partnerProfileProjectImplementationManagement';
import PartnerProfileProjectImplementationFinancialControls from './partnerProfileProjectImplementationFinancialControls';
import PartnerProfileProjectImplementationInternalControls from './partnerProfileProjectImplementationInternalControls';
import PartnerProfileProjectImplementationBankingInfo from './partnerProfileProjectImplementationBankingInfo';
import PartnerProfileProjectImplementationAudit from './partnerProfileProjectImplementationAudit';
import PartnerProfileProjectImplementationReporting from './partnerProfileProjectImplementationReporting';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import { changeTabToNext } from '../../../../reducers/partnerProfileEdit';
import { patchPartnerProfile } from '../../../../reducers/partnerProfileDetailsUpdate';
import { flatten } from '../../../../helpers/jsonMapper';
import { changedValues } from '../../../../helpers/apiHelper';
import { loadPartnerDetails } from '../../../../reducers/partnerProfileDetails';

const STEPS = (readOnly, isCountryProfile) => {
  const hqSteps = [{
    component: <PartnerProfileProjectImplementationManagement readOnly={readOnly} />,
    label: 'Programme Management',
    name: 'program_management',
  },
  {
    component: <PartnerProfileProjectImplementationFinancialControls readOnly={readOnly} />,
    label: 'Financial Controls',
    name: 'financial_controls',
  },
  {
    component: <PartnerProfileProjectImplementationInternalControls readOnly={readOnly} />,
    label: 'Internal Controls',
    name: 'internal_control',
  },
  {
    component: <PartnerProfileProjectImplementationBankingInfo readOnly={readOnly} />,
    label: 'Banking Information',
    name: 'banking_information',
  },
  {
    component: <PartnerProfileProjectImplementationAudit readOnly={readOnly} />,
    label: 'Audit & Assessments',
    name: 'audit',
  },
  {
    component: <PartnerProfileProjectImplementationReporting readOnly={readOnly} />,
    label: 'Reporting',
    name: 'report',
  }];

  if (!isCountryProfile) {
    return R.remove(3, 1, hqSteps);
  }

  return hqSteps;
};


class PartnerProfileProjectImplementation extends Component {
  constructor(props) {
    super(props);

    this.onNextClick = this.onNextClick.bind(this);
  }

  onNextClick(formValues) {
    const { initialValues, updateTab, partnerId,
      changeTab, loadPartnerProfileDetails } = this.props;

    const projectImplementation = flatten(formValues.project_impl);
    const initprojectImplementation = flatten(initialValues.project_impl);

    return updateTab(partnerId, 'project-implementation', changedValues(initprojectImplementation, projectImplementation))
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
    const { readOnly, isCountryProfile } = this.props;

    return (
      <PartnerProfileStepperContainer
        name="project_impl"
        readOnly={readOnly}
        onSubmit={this.onNextClick}
        onNextClick={this.onNextClick}
        steps={STEPS(readOnly, isCountryProfile)}
      />
    );
  }
}

PartnerProfileProjectImplementation.propTypes = {
  readOnly: PropTypes.bool,
  isCountryProfile: PropTypes.object.isRequired,
  partnerId: PropTypes.string,
  updateTab: PropTypes.func,
  initialValues: PropTypes.object,
  loadPartnerProfileDetails: PropTypes.func,
  changeTab: PropTypes.func,
};

const selector = formValueSelector('partnerProfile');
const mapState = (state, ownProps) => ({
  isCountryProfile: selector(state, 'identification.registration.hq'),
  partnerId: ownProps.params.id,
  initialValues: getFormInitialValues('partnerProfile')(state),
});

const mapDispatch = dispatch => ({
  changeTab: () => dispatch(changeTabToNext()),
  loadPartnerProfileDetails: partnerId => dispatch(loadPartnerDetails(partnerId)),
  updateTab: (partnerId, tabName, body) => dispatch(patchPartnerProfile(partnerId, tabName, body)),
  dispatch,
});

const connectedPartnerProfileProjectImplementation = connect(mapState, mapDispatch)(PartnerProfileProjectImplementation);

export default withRouter(connectedPartnerProfileProjectImplementation);

