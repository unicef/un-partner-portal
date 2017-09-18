import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileMandateBackground from './partnerProfileMandateBackground';
import PartnerProfileMandateGovernance from './partnerProfileMandateGovernance';
import PartnerProfileMandateEthics from './partnerProfileMandateEthics';
import PartnerProfileMandateExperience from './partnerProfileMandateExperience';
import PartnerProfileMandatePopulation from './partnerProfileMandatePopulation';
import PartnerProfileMandateCountryPresence from './partnerProfileMandateCountryPresence';
import PartnerProfileMandateSecurity from './partnerProfileMandateSecurity';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = readOnly => [
  {
    component: <PartnerProfileMandateBackground readOnly={readOnly} />,
    label: 'Background',
    name: 'background',
  },
  {
    component: <PartnerProfileMandateGovernance readOnly={readOnly} />,
    label: 'Governance',
    name: 'governance',
  },
  {
    component: <PartnerProfileMandateEthics readOnly={readOnly} />,
    label: 'Ethics',
    name: 'ethics',
  },
  {
    component: <PartnerProfileMandateExperience readOnly={readOnly} />,
    label: 'Experience',
    name: 'experience',
  },
  {
    component: <PartnerProfileMandatePopulation readOnly={readOnly} />,
    label: 'Population of Concern',
    name: 'populationOfConcern',
  },
  {
    component: <PartnerProfileMandateCountryPresence readOnly={readOnly} />,
    label: 'Country Presence',
    name: 'countryPresence',
  },
  {
    component: <PartnerProfileMandateSecurity readOnly={readOnly} />,
    label: 'Security',
    name: 'security',
  },
];

const PartnerProfileMandate = (props) => {
  const { readOnly } = props;

  return (<PartnerProfileStepperContainer
    name="mandate_mission"
    readOnly={readOnly}
    steps={STEPS(readOnly)}
  />
  );
};

PartnerProfileMandate.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileMandate;
