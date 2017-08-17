import React from 'react';
import PropTypes from 'prop-types';

import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

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

export const styleSheet = createStyleSheet('MuiStepper', theme => ({
  root: {
  },
  divider: {
    maxWidth: '100%',
    padding: '1em 1em 3em',
  },
}));

const PartnerProfileProjectImplementationBankingInfo = (props) => {
  const { classes } = props;

  return (
    <Grid item>
      <Grid container direction="column" gutter={16}>
        <Grid item>
          <SelectForm
            fieldName="hasBankAccount"
            label="Does the organization have a bank account?"
            values={BOOL_VAL}
            onFieldChange={this.handleHasBankAccountFieldChange}
            infoIcon
          />
        </Grid>
        <Grid item>
          <SelectForm
            fieldName="hasInterestAccount"
            label="Does the organization currently maintain, or has it previously maintained, a seperate interest-bearing account for UN funded projects that require a seperate account?"
            values={BOOL_VAL}
            onFieldChange={this.handleHasInterestAccountFieldChange}
            infoIcon
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
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

PartnerProfileProjectImplementationBankingInfo.propTypes = {
  /**
   * css classes
   */
  classes: PropTypes.object,
};

export default withStyles(styleSheet)(PartnerProfileProjectImplementationBankingInfo);
