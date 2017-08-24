import React from 'react';
import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';

import SelectForm from '../../forms/selectForm';


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

const PartnerProfileMandateCountryPresence = () => (
  <FormSection name="countryPresence">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <SelectForm
            fieldName="languages"
            label="Select the countries in which the organization operates"
            values={COUNTRY_MENU}
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileMandateCountryPresence;
