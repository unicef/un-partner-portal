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

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'France',
  },
  {
    value: 'it',
    label: 'Italy',
  },
];

const PartnerProfileMandateCountryPresence = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <SelectForm
            fieldName="languages"
            label="Select the countries in which the organization operates"
            values={COUNTRY_MENU}
            onFieldChange={this.handleCountryFieldChange}
            selectFieldProps={{
              multiple: true,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileMandateCountryPresence.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileMandateCountryPresence);
