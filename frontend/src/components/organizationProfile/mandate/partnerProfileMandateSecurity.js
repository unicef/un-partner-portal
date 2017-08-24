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

const PartnerProfileMandateSecurity = () => (
  <FormSection name="security">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <Grid container direction="row">
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="hasAbility"
                label={'Does the organization have the ablility to work in high-risk securit' +
                'locations?'}
                values={BOOL_VAL}
                optional
                warn
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <RadioForm
                fieldName="hasPolicies"
                label={'Does the organization have policies, procedures and practices related to ' +
                'security risk management?'}
                values={BOOL_VAL}
                optional
                warn
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item >
          <TextFieldForm
            label={'Briefly describe the organization\'s ability, if any, to scale-up ' +
            'operations in emergencies or other situations requiring rapid response.'}
            placeholder="Please comment"
            fieldName="emergencyComment"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
            optional
          />
        </Grid>
      </Grid>
    </Grid>
  </FormSection>
);


export default PartnerProfileMandateSecurity;
