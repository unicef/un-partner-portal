import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import PartnerProfileContactInfoMode from './partnerProfileContactInfoMode';
import PartnerProfileContactInfoAddress from './partnerProfileContactInfoAddress';
import PartnerProfileContactInfoOfficials from './partnerProfileContactInfoOfficials';
import PartnerProfileContactInfoLanguages from './partnerProfileContactInfoLanguages';
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
    component: <PartnerProfileContactInfoMode />,
    label: 'History of Partnership',
  },
  {
    component: <PartnerProfileContactInfoAddress />,
    label: 'Accreditation (optional)',
  },
  {
    component: <PartnerProfileContactInfoOfficials />,
    label: 'References (optional)',
  },
  {
    component: <PartnerProfileContactInfoLanguages />,
    label: 'References (optional)',
  },
];

const PartnerProfileContactInfo = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divider}>
      <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
    </div>
  );
};

PartnerProfileContactInfo.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileContactInfo);
