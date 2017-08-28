import React from 'react';

import PartnerProfileContactInfoConnectivity from './partnerProfileContactInfoConnectivity';
import PartnerProfileContactInfoAddress from './partnerProfileContactInfoAddress';
import PartnerProfileContactInfoOfficials from './partnerProfileContactInfoOfficials';
import PartnerProfileContactInfoLanguages from './partnerProfileContactInfoLanguages';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = [
  {
    component: <PartnerProfileContactInfoAddress />,
    label: 'Mailing Address',
    name: 'mailingAddress',
  },
  {
    component: <PartnerProfileContactInfoOfficials />,
    label: 'Authorized Officials',
    name: 'authorizedOfficials',
  },
  {
    component: <PartnerProfileContactInfoConnectivity />,
    label: 'Connectivity',
    name: 'connectivity',
  },
  {
    component: <PartnerProfileContactInfoLanguages />,
    label: 'Working Languages',
    name: 'workingLanguages',
  },
];

const PartnerProfileContactInfo = () => (
  <PartnerProfileStepperContainer
    name="contactInfo"
    steps={STEPS}
  />
);


export default PartnerProfileContactInfo;
