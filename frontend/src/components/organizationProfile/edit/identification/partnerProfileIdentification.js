import React from 'react';

import PartnerProfileIdentificationBasicInfo from './partnerProfileIdentificationBasicInfo';
import PartnerProfileIdentificationRegistration from './partnerProfileIdentificationRegistration';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = [
  {
    component: <PartnerProfileIdentificationBasicInfo />,
    label: 'Basic Information',
    name: 'basicInfo',
  },
  {
    component: <PartnerProfileIdentificationRegistration />,
    label: 'Registration of Organization',
    name: 'registration',
  },
];

const PartnerProfileIdentification = () => (
  <PartnerProfileStepperContainer
    name="identification"
    steps={STEPS}
  />
);

export default PartnerProfileIdentification;

