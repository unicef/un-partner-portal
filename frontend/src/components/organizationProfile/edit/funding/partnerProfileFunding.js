import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileFundingBudget from './partnerProfileFundingBudget';
import PartnerProfileFundingDonors from './partnerProfileFundingDonors';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

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

const PartnerProfileFunding = (props) => {
  const { readOnly } = props;
  return (<PartnerProfileStepperContainer
    name="fund"
    steps={STEPS(readOnly)}
    readOnly={readOnly}
  />
  );
};

PartnerProfileFunding.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileFunding;
