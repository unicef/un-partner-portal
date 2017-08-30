import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';

import SelectForm from '../../../forms/selectForm';
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

const PartnerProfileProjectImplementationBankingInfo = () => (
  <FormSection name="bankingInformation">
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <SelectForm
            fieldName="hasBankAccount"
            label="Does the organization have a bank account?"
            values={BOOL_VAL}
            optional
            warn
          />
        </Grid>
        <Grid item>
          <SelectForm
            fieldName="hasInterestAccount"
            label={'Does the organization currently maintain, or has it previously maintained, ' +
            'a seperate interest-bearing account for UN funded projects that require a seperate ' +
            'account?'}
            values={BOOL_VAL}
            optional
            warn
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Briefly explain the system used"
            placeholder="200 character maximum"
            fieldName="bankingDescription"
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
  </FormSection>
);


export default PartnerProfileProjectImplementationBankingInfo;
