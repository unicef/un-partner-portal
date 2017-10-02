import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
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

const PartnerProfileProjectImplementationBankingInfo = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="bankingInformation">
      <Grid item>
        <Grid container direction="column" spacing={16}>
          <Grid item>
            <SelectForm
              fieldName="hasBankAccount"
              label="Does the organization have a bank account?"
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
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
              readOnly={readOnly}
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
              readOnly={readOnly}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormSection>
  );
};

PartnerProfileProjectImplementationBankingInfo.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileProjectImplementationBankingInfo;
