import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileOtherInfoContent from './partnerProfileOtherInfoContent';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';


const STEPS = readOnly => [
  {
    component: <PartnerProfileOtherInfoContent readOnly={readOnly} />,
    label: '',
    name: 'content',
  },
];

const PartnerProfileOtherInfo = (props) => {
  const { readOnly } = props;

  return (
    <PartnerProfileStepperContainer
      name="otherInformation"
      steps={STEPS(readOnly)}
      readOnly={readOnly}
      last
    />
  );
};

PartnerProfileOtherInfo.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileOtherInfo;
