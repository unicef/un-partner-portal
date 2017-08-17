import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileFundingBudget from './partnerProfileFundingBudget';
import PartnerProfileFundingDonors from './partnerProfileFundingDonors';
import PartnerProfileStepper from '../partnerProfileStepper';

const styleSheet = createStyleSheet('registration', theme => ({
  container: {
    position: 'absolute',
    height: '100%',
  },
  header: {
    color: theme.palette.primary[400],
    backgroundColor: theme.palette.accent[500],
    marginBottom: '1em',
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const STEPS = [
  {
    component: <PartnerProfileFundingBudget />,
    label: 'Budget',
  },
  {
    component: <PartnerProfileFundingDonors />,
    label: 'Major Donors',
  },
];

const PartnerProfileFunding = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divider}>
      <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
    </div>
  );
};

PartnerProfileFunding.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileFunding);
