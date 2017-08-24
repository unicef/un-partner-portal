import React from 'react';

import PartnerProfileMandateBackground from './partnerProfileMandateBackground';
import PartnerProfileMandateGovernance from './partnerProfileMandateGovernance';
import PartnerProfileMandateEthics from './partnerProfileMandateEthics';
import PartnerProfileMandateExperience from './partnerProfileMandateExperience';
import PartnerProfileMandatePopulation from './partnerProfileMandatePopulation';
import PartnerProfileMandateCountryPresence from './partnerProfileMandateCountryPresence';
import PartnerProfileMandateSecurity from './partnerProfileMandateSecurity';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = [
  {
    component: <PartnerProfileMandateBackground />,
    label: 'Background',
    name: 'background',
  },
  {
    component: <PartnerProfileMandateGovernance />,
    label: 'Governance',
    name: 'governance',
  },
  {
    component: <PartnerProfileMandateEthics />,
    label: 'Ethics',
    name: 'ethics',
  },
  {
    component: <PartnerProfileMandateExperience />,
    label: 'Experience',
    name: 'experience',
  },
  {
    component: <PartnerProfileMandatePopulation />,
    label: 'Population of Concern',
    name: 'populationOfConcern',
  },
  {
    component: <PartnerProfileMandateCountryPresence />,
    label: 'Country Presence',
    name: 'countryPresence',
  },
  {
    component: <PartnerProfileMandateSecurity />,
    label: 'Security',
    name: 'security',
  },
];

const PartnerProfileMandate = () => (
  <PartnerProfileStepperContainer
    name="mandateMission"
    steps={STEPS}
  />
);


export default PartnerProfileMandate;
