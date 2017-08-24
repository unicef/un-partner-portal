import React from 'react';
import Grid from 'material-ui/Grid';
import { FormSection } from 'redux-form';
import TextFieldForm from '../../forms/textFieldForm';

const PartnerProfileMandateBackground = () => (
  <FormSection name="background">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <TextFieldForm
            label={'Briefly state the background and rationale for the establishment of the ' +
            'organization'}
            placeholder="Please limit your response to 400 characters"
            fieldName="background"
            textFieldProps={{
              inputProps: {
                maxLength: '400',
              },
            }}
            optional
            warn
          />
        </Grid>
        <Grid item>
          <TextFieldForm
            label="Briefly state the mandate and mission of the organization"
            placeholder="Please limit your response to 400 characters"
            fieldName="mandate"
            textFieldProps={{
              inputProps: {
                maxLength: '400',
              },
            }}
            optional
            warn
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileMandateBackground;
