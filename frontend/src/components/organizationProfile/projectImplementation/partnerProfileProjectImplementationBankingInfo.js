import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const BOOL_VAL = [
  {
    value: 'yes',
    label: 'Yes'
  },
  {
    value: 'no',
    label: 'No'
  }
]

const METHOD_VAL = [
  {
    value: 'cash',
    label: 'Cash'
  },
  {
    value: 'Acc',
    label: 'Accrual'
  }
]

const ACCOUNTING_MENU = [
  {
    value: '1',
    label: 'Computerized accounting system'
  },
  {
    value: '2',
    label: '3rd Party Accounting Service'
  },
  {
    value: '3',
    label: 'Manual accounting system'
  }
]

class PartnerProfileProjectImplementationBankingInfo extends Component {

  constructor(props) {
    super(props);
    this.state = { hasBankAccount: undefined, hasInterestAccount: undefined };
    this.handleHasBankAccountFieldChange = this.handleHasBankAccountFieldChange.bind(this);
    this.handleHasInterestAccountFieldChange = this.handleHasInterestAccountFieldChange.bind(this);
  }

  handleHasBankAccountFieldChange(value) {
    this.setState({ hasBankAccount: value });
  }

  handleHasInterestAccountFieldChange(value) {
    this.setState({ hasInterestAccount: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <SelectForm
              fieldName='hasBankAccount'
              label="Does the organization have a bank account?"
              values={BOOL_VAL}
              onFieldChange={this.handleHasBankAccountFieldChange}
              infoIcon
            />
          </Grid>
          <Grid item>
            <SelectForm
              fieldName='hasInterestAccount'
              label="Does the organization currently maintain, or has it previously maintained, a seperate interest-bearing account for UN funded projects that require a seperate account?"
              values={BOOL_VAL}
              onFieldChange={this.handleHasInterestAccountFieldChange}
              infoIcon
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Briefly explain the system used"
              placeholder='200 character maximum'
              fieldName='bankingDescription'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileProjectImplementationBankingInfo;