import React from 'react';

import PartnerProfileOtherInfoContent from './partnerProfileOtherInfoContent';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';


const STEPS = [
  {
    component: <PartnerProfileOtherInfoContent />,
    label: '',
    name: 'content',
  },
];

const PartnerProfileOtherInfo = () => (
  <PartnerProfileStepperContainer
    name="otherInfo"
    steps={STEPS}
    last
  />
);


export default PartnerProfileOtherInfo;
