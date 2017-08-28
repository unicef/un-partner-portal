import React from 'react';

import PartnerProfileFundingBudget from './partnerProfileFundingBudget';
import PartnerProfileFundingDonors from './partnerProfileFundingDonors';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = [
  {
    component: <PartnerProfileFundingBudget />,
    label: 'Budget',
    name: 'budget',
  },
  {
    component: <PartnerProfileFundingDonors />,
    label: 'Major Donors',
    name: 'majorDonors',
  },
];

const PartnerProfileFunding = () => (
  <PartnerProfileStepperContainer
    name="funding"
    steps={STEPS}
  />
);


export default PartnerProfileFunding;
