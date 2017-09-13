import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileFundingBudget from './partnerProfileFundingBudget';
import PartnerProfileFundingDonors from './partnerProfileFundingDonors';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = readOnly => [
  {
    component: <PartnerProfileFundingBudget readOnly={readOnly} />,
    label: 'Budget',
    name: 'budget',
  },
  {
    component: <PartnerProfileFundingDonors readOnly={readOnly} />,
    label: 'Major Donors',
    name: 'majorDonors',
  },
];

const PartnerProfileFunding = (props) => {
  const { readOnly } = props;
  return (<PartnerProfileStepperContainer
    name="funding"
    steps={STEPS(readOnly)}
    readOnly={readOnly}
  />
  );
};

PartnerProfileFunding.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileFunding;
