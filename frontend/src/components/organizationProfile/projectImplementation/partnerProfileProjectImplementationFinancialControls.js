import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';
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

const METHOD_VAL = [
  {
    value: 'cash',
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

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const PartnerProfileProjectImplementationFinancialControls = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <SelectForm
            fieldName="accountingType"
            label="Please select your organization's accounting system"
            values={ACCOUNTING_MENU}
            onFieldChange={this.handleAccountingTypeFieldChange}
            infoIcon
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="method"
            label="What is the method of accounting adopted by the organization?"
            values={METHOD_VAL}
            onFieldChange={this.handleMethodFieldChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <RadioForm
            fieldName="tracking"
            label="Does your organization have a system to track expenditures, prepare project reports, and prepare claims for donors?"
            values={BOOL_VAL}
            onFieldChange={this.handleApproachFieldChange}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Briefly explain the system used"
            placeholder="200 character maximum"
            fieldName="trackingDescription"
            textFieldProps={{
              inputProps: {
                maxLength: '200',
              },
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileProjectImplementationFinancialControls.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileProjectImplementationFinancialControls);
