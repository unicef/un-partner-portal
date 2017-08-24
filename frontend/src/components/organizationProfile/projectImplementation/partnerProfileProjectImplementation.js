import React from 'react';

import PartnerProfileProjectImplementationManagement from './partnerProfileProjectImplementationManagement';
import PartnerProfileProjectImplementationFinancialControls from './partnerProfileProjectImplementationFinancialControls';
import PartnerProfileProjectImplementationInternalControls from './partnerProfileProjectImplementationInternalControls';
import PartnerProfileProjectImplementationBankingInfo from './partnerProfileProjectImplementationBankingInfo';
import PartnerProfileProjectImplementationAudit from './partnerProfileProjectImplementationAudit';
import PartnerProfileProjectImplementationReporting from './partnerProfileProjectImplementationReporting';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = [
  {
    component: <PartnerProfileProjectImplementationManagement />,
    label: 'Programme Management',
    name: 'programmeManagement',
  },
  {
    component: <PartnerProfileProjectImplementationFinancialControls />,
    label: 'Financial Controls',
    name: 'financialControls',
  },
  {
    component: <PartnerProfileProjectImplementationInternalControls />,
    label: 'Internal Controls',
    name: 'internalControls',
  },
  {
    component: <PartnerProfileProjectImplementationBankingInfo />,
    label: 'Banking Information',
    name: 'bankingInformation',
  },
  {
    component: <PartnerProfileProjectImplementationAudit />,
    label: 'Audit & Assessments',
    name: 'auditAssessment',
  },
  {
    component: <PartnerProfileProjectImplementationReporting />,
    label: 'Reporting',
    name: 'reporting',
  },
];

const PartnerProfileProjectImplementation = () => (
  <PartnerProfileStepperContainer
    name="implementation"
    steps={STEPS}
  />
);


export default PartnerProfileProjectImplementation;
