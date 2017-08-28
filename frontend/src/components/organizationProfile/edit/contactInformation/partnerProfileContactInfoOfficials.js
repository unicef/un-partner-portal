import React from 'react';
import { FormSection } from 'redux-form';

import Grid from 'material-ui/Grid';

import RadioForm from '../../../forms/radioForm';
import TextFieldForm from '../../../forms/textFieldForm';


const BOOL_VAL = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

const PartnerProfileContactInfoOfficials = () => (
  <FormSection name="authorizedOfficials">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="hasBoD"
            label="Does your Organization have a Board of Directors?"
            values={BOOL_VAL}
          />
        </Grid>

        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="First Name"
                placeholder=""
                fieldName="firstName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Last Name"
                placeholder=""
                fieldName="lastName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Job Title/Position"
                placeholder=""
                fieldName="job"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="isAuthorisedOfficer"
                label="Authorised Officer?"
                values={BOOL_VAL}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="First Name"
                placeholder=""
                fieldName="firstName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Last Name"
                placeholder=""
                fieldName="lastName"
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Job Title/Position"
                placeholder=""
                fieldName="job"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileContactInfoOfficials;
