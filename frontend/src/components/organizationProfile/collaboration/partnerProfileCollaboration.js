import React from 'react';

import PartnerProfileCollaborationHistory from './partnerProfileCollaborationHistory';
import PartnerProfileCollaborationAccreditation from './partnerProfileCollaborationAccreditation';
import PartnerProfileCollaborationReferences from './partnerProfileCollaborationReferences';
import PartnerProfileStepperContainer from '../partnerProfileStepperContainer';

const STEPS = [
  {
    component: <PartnerProfileCollaborationHistory />,
    label: 'History of Partnership',
    name: 'history',
  },
  {
    component: <PartnerProfileCollaborationAccreditation />,
    label: 'Accreditation (optional)',
    name: 'accreditation',
  },
  {
    component: <PartnerProfileCollaborationReferences />,
    label: 'References (optional)',
    name: 'references',
  },
];

const PartnerProfileCollaboration = () => (
  <PartnerProfileStepperContainer
    name="collaboration"
    steps={STEPS}
  />
);


export default PartnerProfileCollaboration;
