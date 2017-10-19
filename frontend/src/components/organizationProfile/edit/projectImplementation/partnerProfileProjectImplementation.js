import React from 'react';
import R from 'ramda';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import PartnerProfileProjectImplementationManagement from './partnerProfileProjectImplementationManagement';
import PartnerProfileProjectImplementationFinancialControls from './partnerProfileProjectImplementationFinancialControls';
import PartnerProfileProjectImplementationInternalControls from './partnerProfileProjectImplementationInternalControls';
import PartnerProfileProjectImplementationBankingInfo from './partnerProfileProjectImplementationBankingInfo';
import PartnerProfileProjectImplementationAudit from './partnerProfileProjectImplementationAudit';
import PartnerProfileProjectImplementationReporting from './partnerProfileProjectImplementationReporting';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

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

const PartnerProfileProjectImplementation = (props) => {
  const { readOnly, isCountryProfile } = props;

  return (
    <PartnerProfileStepperContainer
      name="project_impl"
      readOnly={readOnly}
      steps={STEPS(readOnly, isCountryProfile)}
    />
  );
};

PartnerProfileProjectImplementation.propTypes = {
  readOnly: PropTypes.bool,
  isCountryProfile: PropTypes.object.isRequired,
};

const selector = formValueSelector('partnerProfile');
export default connect(
  state => ({
    isCountryProfile: selector(state, 'identification.registration.hq'),
  }),
)(PartnerProfileProjectImplementation);

