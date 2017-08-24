import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import TextFieldForm from '../../forms/textFieldForm';

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

const PartnerProfileProjectImplementationManagement = () => (
  <FormSection name="programmeManagement">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="approach"
            label="Do you use a results-based approach to managing programmes and projects?"
            values={BOOL_VAL}
            optional
            warn
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Please provide a brief description of your management approach"
            placeholder="200 character maximum"
            fieldName="approachDescription"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
            warn
          />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="approach"
                label={'Does your organization have a system for monitoring and evaluating ' +
                'its projects & programmes?'}
                values={BOOL_VAL}
                optional
                warn
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Briefly explain your M&E system"
                placeholder="200 character maximum"
                fieldName="approachDescription"
                textFieldProps={{
                  inputProps: {
                    maxLength: '200',
                  },
                }}
                optional
                warn
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="approach"
                label={'Does the organization have systems or procedures in place for ' +
                'beneficaries to provide feedback on prject activities?'}
                values={BOOL_VAL}
                optional
                warn
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextFieldForm
                label="Briefly explain your feedback mechanism"
                placeholder="200 character maximum"
                fieldName="approachDescription"
                textFieldProps={{
                  inputProps: {
                    maxLength: '200',
                  },
                }}
                optional
                warn
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileProjectImplementationManagement;
