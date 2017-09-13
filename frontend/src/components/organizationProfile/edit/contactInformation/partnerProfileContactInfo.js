import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileContactInfoConnectivity from './partnerProfileContactInfoConnectivity';
import PartnerProfileContactInfoAddress from './partnerProfileContactInfoAddress';
import PartnerProfileContactInfoOfficials from './partnerProfileContactInfoOfficials';
import PartnerProfileContactInfoLanguages from './partnerProfileContactInfoLanguages';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = readOnly =>
  [
    {
      component: <PartnerProfileContactInfoAddress readOnly={readOnly} />,
      label: 'Mailing Address',
      name: 'mailingAddress',
    },
    {
      component: <PartnerProfileContactInfoOfficials readOnly={readOnly} />,
      label: 'Authorized Officials',
      name: 'authorizedOfficials',
    },
    {
      component: <PartnerProfileContactInfoConnectivity readOnly={readOnly} />,
      label: 'Connectivity',
      name: 'connectivity',
    },
    {
      component: <PartnerProfileContactInfoLanguages readOnly={readOnly} />,
      label: 'Working Languages',
      name: 'workingLanguages',
    },
  ];

const PartnerProfileContactInfo = (props) => {
  const { readOnly } = props;

  return (<PartnerProfileStepperContainer
    name="contactInfo"
    readOnly={readOnly}
    steps={STEPS(readOnly)}
  />);
};

PartnerProfileContactInfo.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileContactInfo;
