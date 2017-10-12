import React from 'react';
import PropTypes from 'prop-types';
import PartnerProfileCollaborationHistory from './partnerProfileCollaborationHistory';
import PartnerProfileCollaborationAccreditation from './partnerProfileCollaborationAccreditation';
import PartnerProfileCollaborationReferences from './partnerProfileCollaborationReferences';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = readOnly => [
  {
    component: <PartnerProfileCollaborationHistory readOnly={readOnly} />,
    label: 'History of Partnership',
    name: 'history',
  },
  {
    component: <PartnerProfileCollaborationAccreditation readOnly={readOnly} />,
    label: 'Accreditation (optional)',
    name: 'accreditation',
  },
  {
    component: <PartnerProfileCollaborationReferences readOnly={readOnly} />,
    label: 'References (optional)',
    name: 'reference',
  },
];

const PartnerProfileCollaboration = (props) => {
  const { readOnly } = props;

  return (<PartnerProfileStepperContainer
    name="collaboration"
    readOnly={readOnly}
    steps={STEPS(readOnly)}
  />
  );
};

PartnerProfileCollaboration.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileCollaboration;
