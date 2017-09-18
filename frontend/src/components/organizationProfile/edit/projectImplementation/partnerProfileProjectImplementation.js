import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileProjectImplementationManagement from './partnerProfileProjectImplementationManagement';
import PartnerProfileProjectImplementationFinancialControls from './partnerProfileProjectImplementationFinancialControls';
import PartnerProfileProjectImplementationInternalControls from './partnerProfileProjectImplementationInternalControls';
import PartnerProfileProjectImplementationBankingInfo from './partnerProfileProjectImplementationBankingInfo';
import PartnerProfileProjectImplementationAudit from './partnerProfileProjectImplementationAudit';
import PartnerProfileProjectImplementationReporting from './partnerProfileProjectImplementationReporting';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = readOnly => [
  {
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
    name: 'internalControls',
  },
  {
    component: <PartnerProfileProjectImplementationBankingInfo readOnly={readOnly} />,
    label: 'Banking Information',
    name: 'bankingInformation',
  },
  {
    component: <PartnerProfileProjectImplementationAudit readOnly={readOnly} />,
    label: 'Audit & Assessments',
    name: 'audit',
  },
  {
    component: <PartnerProfileProjectImplementationReporting readOnly={readOnly} />,
    label: 'Reporting',
    name: 'reporting',
  },
];

const PartnerProfileProjectImplementation = (props) => {
  const { readOnly } = props;

  return (
    <PartnerProfileStepperContainer
      name="project_impl"
      readOnly={readOnly}
      steps={STEPS(readOnly)}
    />
  );
};

PartnerProfileProjectImplementation.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileProjectImplementation;
