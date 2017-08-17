import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileCollaborationHistory from './partnerProfileCollaborationHistory';
import PartnerProfileCollaborationAccreditation from './partnerProfileCollaborationAccreditation';
import PartnerProfileCollaborationReferences from './partnerProfileCollaborationReferences';
import PartnerProfileStepper from '../partnerProfileStepper';

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const STEPS = [
  {
    component: <PartnerProfileCollaborationHistory />,
    label: 'History of Partnership',
  },
  {
    component: <PartnerProfileCollaborationAccreditation />,
    label: 'Accreditation (optional)',
  },
  {
    component: <PartnerProfileCollaborationReferences />,
    label: 'References (optional)',
  },
];

const PartnerProfileCollaboration = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divider}>
      <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
    </div>
  );
};

PartnerProfileCollaboration.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileCollaboration);
