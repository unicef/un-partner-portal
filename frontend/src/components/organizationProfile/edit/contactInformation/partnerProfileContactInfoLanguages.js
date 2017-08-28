import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';

import SelectForm from '../../../forms/selectForm';
import TextFieldForm from '../../../forms/textFieldForm';


const COUNTRY_MENU = [
  {
    value: 'ar',
    label: 'Arabic',
  },
  {
    value: 'ch',
    label: 'Chinese',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'fr',
    label: 'French',
  },
  {
    value: 'ru',
    label: 'Russian',
  },
  {
    value: 'ot',
    label: 'Other',
  },
];


const PartnerProfileContactInfoLanguages = () => (
  <FormSection name="workingLanguages">
    <Grid item>
      <Grid container direction="row">
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="languages"
            label="Working Language(s) of your Organization"
            placeholder="Select language"
            values={COUNTRY_MENU}
            selectFieldProps={{
              multiple: true,
            }}
            optional
            warn
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Please State"
            placeholder="Additional languages known"
            fieldName="extraLanguage"
            optional
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileContactInfoLanguages;
