import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import SelectForm from '../../forms/selectForm';

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const DONORS_MENU = [
  {
    value: '1',
    label: 'Individuals',
  },
  {
    value: '2',
    label: 'United Nations Agency',
  },
  {
    value: '3',
    label: 'Governments',
  },
];

const PartnerProfileCollaborationReferences = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <SelectForm
        fieldName="donors"
        label="Please select the type of donors that fund your agency"
        values={DONORS_MENU}
        onFieldChange={this.handleDonorFieldChange}
        infoIcon
      />
    </Grid>
  );
};

PartnerProfileCollaborationReferences.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileCollaborationReferences);
