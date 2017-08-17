import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileMandateBackground from './partnerProfileMandateBackground';
import PartnerProfileMandateGovernance from './partnerProfileMandateGovernance';
import PartnerProfileMandateEthics from './partnerProfileMandateEthics';
import PartnerProfileMandateExperience from './partnerProfileMandateExperience';
import PartnerProfileMandatePopulation from './partnerProfileMandatePopulation';
import PartnerProfileMandateCountryPresence from './partnerProfileMandateCountryPresence';
import PartnerProfileMandateSecurity from './partnerProfileMandateSecurity';
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
    component: <PartnerProfileMandateBackground />,
    label: 'Background',
  },
  {
    component: <PartnerProfileMandateGovernance />,
    label: 'Governance',
  },
  {
    component: <PartnerProfileMandateEthics />,
    label: 'Ethics',
  },
  {
    component: <PartnerProfileMandateExperience />,
    label: 'Experience',
  },
  {
    component: <PartnerProfileMandatePopulation />,
    label: 'Population of Concern',
  },
  {
    component: <PartnerProfileMandateCountryPresence />,
    label: 'Country Presence',
  },
  {
    component: <PartnerProfileMandateSecurity />,
    label: 'Security',
  },
];

const PartnerProfileMandate = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divider}>
      <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
    </div>
  );
};

PartnerProfileMandate.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileMandate);
