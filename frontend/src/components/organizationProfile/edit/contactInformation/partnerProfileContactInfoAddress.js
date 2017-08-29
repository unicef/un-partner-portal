import React from 'react';

import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';

import RadioForm from '../../../forms/radioForm';
import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';

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

const PartnerProfileContactInfoAddress = () => (
  <FormSection name="mailingAddress">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="addressType"
            label="Type of Mailing Address"
            values={ADDRESS_VALUES}
            optional
            warn
          />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label="Street Address or PO Box Number"
                placeholder=""
                fieldName="streetAddress"
                optional
                warn
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label="City"
                placeholder=""
                fieldName="city"
                optional
                warn
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <SelectForm
                fieldName="country"
                label="Country"
                values={COUNTRY_MENU}
                optional
                warn
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label="Zip Code (optional)"
                placeholder=""
                fieldName="zipCode"
                optional
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label="Telephone"
                placeholder=""
                fieldName="telephone"
                optional
                warn
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label="Fax (optional"
                placeholder=""
                fieldName="fax"
                optional
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextFieldForm
                label="Website (optional)"
                placeholder=""
                fieldName="website"
                optional
              />
            </Grid>
            <Grid item sm={3} xs={12}>
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
  </FormSection>
);


export default PartnerProfileContactInfoAddress;
