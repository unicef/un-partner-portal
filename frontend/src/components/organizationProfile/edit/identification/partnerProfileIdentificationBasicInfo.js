import React from 'react';

import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';

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

const ORG_VALUES = [
  {
    value: 'ngo',
    label: 'National NGO',
  },
  {
    value: 'ingo',
    label: 'International NGO (INGO)',
  },
];

const PartnerProfileIdentificationBasicInfo = () => (
  <FormSection name="basicInfo">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <TextFieldForm
          label="Organization's Legal Name"
          fieldName="legalName"
          optional
          warn
        />
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Alias (if applicable)"
            fieldName="legalNameAlias"
            placeholder="Provide alias"
            optional
            warn
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Acronym (if applicable)"
            fieldName="acronym"
            placeholder="Provide acronym"
            optional
            warn
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Organization's former Legal Name"
            fieldName="formerName"
            optional
            warn
          />
        </Grid>
        <SelectForm
          fieldName="country"
          label="Country of Origin"
          values={COUNTRY_MENU}
          optional
          warn
        />
        <Grid item sm={6} xs={12}>
          <SelectForm
            fieldName="organizationType"
            label="Type of organization"
            values={ORG_VALUES}
            infoIcon
            optional
            warn
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileIdentificationBasicInfo;

