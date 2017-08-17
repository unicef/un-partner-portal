import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';

import PartnerProfileProjectImplementationManagement from './partnerProfileProjectImplementationManagement';
import PartnerProfileProjectImplementationFinancialControls from './partnerProfileProjectImplementationFinancialControls';
import PartnerProfileProjectImplementationInternalControls from './partnerProfileProjectImplementationInternalControls';
import PartnerProfileProjectImplementationBankingInfo from './partnerProfileProjectImplementationBankingInfo';
import PartnerProfileProjectImplementationAudit from './partnerProfileProjectImplementationAudit';
import PartnerProfileProjectImplementationReporting from './partnerProfileProjectImplementationReporting';
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
    component: <PartnerProfileProjectImplementationManagement />,
    label: 'Programme Management',
  },
  {
    component: <PartnerProfileProjectImplementationFinancialControls />,
    label: 'Financial Controls',
  },
  {
    component: <PartnerProfileProjectImplementationInternalControls />,
    label: 'Internal Controls',
  },
  {
    component: <PartnerProfileProjectImplementationBankingInfo />,
    label: 'Banking Information',
  },
  {
    component: <PartnerProfileProjectImplementationAudit />,
    label: 'Audit & Assessments',
  },
  {
    component: <PartnerProfileProjectImplementationReporting />,
    label: 'Reporting',
  },
];

const PartnerProfileProjectImplementation = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divider}>
      <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
    </div>
  );
};

PartnerProfileProjectImplementation.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileProjectImplementation);
