import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import PartnerProfileIdentificationBasicInfo from './partnerProfileIdentificationBasicInfo';
import PartnerProfileIdentificationRegistration from './partnerProfileIdentificationRegistration';
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
    component: <PartnerProfileIdentificationBasicInfo />,
    label: 'Basic Information',
  },
  {
    component: <PartnerProfileIdentificationRegistration />,
    label: 'Registration of Organization',
  },
];

const PartnerProfileIdentification = (props) => {
  const { classes } = props;

  return (
    <div className={classes.divider}>
      <PartnerProfileStepper onSubmit={this.handleSubmit} first steps={STEPS} />
    </div>
  );
};

PartnerProfileIdentification.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileIdentification);
