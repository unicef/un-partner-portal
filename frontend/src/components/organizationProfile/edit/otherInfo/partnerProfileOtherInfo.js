import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileOtherInfoContent from './partnerProfileOtherInfoContent';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';


const STEPS = readOnly => [
  {
    component: <PartnerProfileOtherInfoContent readOnly={readOnly} />,
    label: 'Other Informations',
    name: 'other_info',
  },
];

const PartnerProfileOtherInfo = (props) => {
  const { readOnly } = props;

  return (
    <PartnerProfileStepperContainer
      name="other_info"
      steps={STEPS(readOnly)}
      readOnly={readOnly}
      last
      singleSection
    />
  );
};

PartnerProfileOtherInfo.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileOtherInfo;
