import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileIdentificationBasicInfo from './partnerProfileIdentificationBasicInfo';
import PartnerProfileIdentificationRegistration from './partnerProfileIdentificationRegistration';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = readOnly =>
  [
    {
      component: <PartnerProfileIdentificationBasicInfo />,
      label: 'Basic Information',
      name: 'basic',
    },
    {
      component: <PartnerProfileIdentificationRegistration readOnly={readOnly} />,
      label: 'Registration of Organization',
      name: 'registration',
    },
  ];

const PartnerProfileIdentification = (props) => {
  const { readOnly } = props;

  return (
    <PartnerProfileStepperContainer
      name="identification"
      steps={STEPS(readOnly)}
      readOnly={readOnly}
    />);
};

PartnerProfileIdentification.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileIdentification;

