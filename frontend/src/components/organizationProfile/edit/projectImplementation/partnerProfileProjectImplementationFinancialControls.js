import React from 'react';
import { FormSection } from 'redux-form';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import RadioForm from '../../../forms/radioForm';
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

const METHOD_VAL = [
  {
    value: 'Cas',
    label: 'Cash',
  },
  {
    value: 'Acc',
    label: 'Accrual',
  },
];

const ACCOUNTING_MENU = [
  {
    value: '1',
    label: 'Computerized accounting system',
  },
  {
    value: '2',
    label: '3rd Party Accounting Service',
  },
  {
    value: '3',
    label: 'Manual accounting system',
  },
];

const PartnerProfileProjectImplementationFinancialControls = (props) => {
  const { readOnly } = props;

  return (
    <FormSection name="financial_controls">
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <SelectForm
              fieldName="org_acc_system"
              label="Your organization's accounting system"
              values={ACCOUNTING_MENU}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <RadioForm
              fieldName="method_acc"
              label="What is the method of accounting adopted by the organization?"
              values={METHOD_VAL}
              optional
              warn
              readOnly={readOnly}
              renderTextSelection
            />
          </Grid>
          <Grid item>
            <RadioForm
              fieldName="have_system_track"
              label={'Does your organization have a system to track expenditures, prepare project ' +
            'reports, and prepare claims for donors?'}
              values={BOOL_VAL}
              optional
              warn
              readOnly={readOnly}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Briefly explain the system used"
              placeholder="200 character maximum"
              fieldName="financial_control_system_desc"
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

PartnerProfileProjectImplementationFinancialControls.propTypes = {
  readOnly: PropTypes.bool,
};

export default PartnerProfileProjectImplementationFinancialControls;
