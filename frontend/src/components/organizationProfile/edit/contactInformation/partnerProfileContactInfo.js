import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileContactInfoConnectivity from './partnerProfileContactInfoConnectivity';
import PartnerProfileContactInfoAddress from './partnerProfileContactInfoAddress';
import PartnerProfileContactInfoOfficials from './partnerProfileContactInfoOfficials';
import PartnerProfileContactInfoLanguages from './partnerProfileContactInfoLanguages';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';
import PartnerProfileContactInfoHeadOrganization from './partnerProfileContactInfoHeadOrganization';

const STEPS = readOnly =>
  [
    {
      component: <PartnerProfileContactInfoAddress readOnly={readOnly} />,
      label: 'Mailing Address',
      name: 'address',
    },
    {
      component: <PartnerProfileContactInfoOfficials readOnly={readOnly} />,
      label: 'Authorized Officials',
      name: 'authorised_officials',
    },
    {
      component: <PartnerProfileContactInfoHeadOrganization readOnly={readOnly} />,
      label: 'Head of Organization',
      name: 'org_head',
    },
    {
      component: <PartnerProfileContactInfoConnectivity readOnly={readOnly} />,
      label: 'Connectivity',
      name: 'connectivity',
    },
    {
      component: <PartnerProfileContactInfoLanguages readOnly={readOnly} />,
      label: 'Working Languages',
      name: 'working_languages',
    },
  ];

const PartnerProfileContactInfo = (props) => {
  const { readOnly } = props;

  return (<PartnerProfileStepperContainer
    name="mailing"
    readOnly={readOnly}
    steps={STEPS(readOnly)}
  />);
};

PartnerProfileContactInfo.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileContactInfo;
