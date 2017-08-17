import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';

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

const ADDRESS_VALUES = [
  {
    value: 'street',
    label: 'Street Address',
  },
  {
    value: 'po',
    label: 'PO Box',
  },
];

const PartnerProfileContactInfoAddress = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="addressType"
            label="Type of Mailing Address"
            values={ADDRESS_VALUES}
            onFieldChange={this.handleAddressFieldChange}
          />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Street Address or PO Box Number"
                placeholder=""
                fieldName="streetAddress"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="City"
                placeholder=""
                fieldName="city"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <SelectForm
                fieldName="country"
                label="Country"
                values={COUNTRY_MENU}
                onFieldChange={this.handleCountryFieldChange}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Zip Code (optional)"
                placeholder=""
                fieldName="zipCode"
                optional
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Telephone"
                placeholder=""
                fieldName="telephone"
                optional
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Fax (optional"
                placeholder=""
                fieldName="fax"
                optional
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Website (optional)"
                placeholder=""
                fieldName="website"
                optional
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Organization Email (optional)"
                placeholder=""
                fieldName="orgEmail"
                optional
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileContactInfoAddress.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileContactInfoAddress);
