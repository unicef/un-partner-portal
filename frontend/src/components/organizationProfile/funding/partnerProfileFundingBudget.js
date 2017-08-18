import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import { FormControl, FormLabel } from 'material-ui/Form';

import RadioForm from '../../forms/radioForm';
import SelectForm from '../../forms/selectForm';
import TextFieldForm from '../../forms/textFieldForm';


const NAME_CHANGE = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
];

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'France',
  },
  {
    value: 'it',
    label: 'Italy',
  },
];

const BUDGET_VALUES = [
  {
    value: '1',
    label: '0 to 200,000',
  },
  {
    value: '2',
    label: '200,000 to 500,000',
  },
  {
    value: '3',
    label: '500,000 to 1,000,000',
  },
  {
    value: '4',
    label: '1,000,000 to 2,000,000',
  },
];

const STAFF_VALUES = [
  {
    value: '1',
    label: '1-10',
  },
  {
    value: '2',
    label: '11-50',
  },
  {
    value: '3',
    label: '51-100',
  },
  {
    value: '4',
    label: '101-200',
  },
];

class PartnerProfileFundingBudget extends Component {
  constructor(props) {
    super(props);
    this.state = { budget: undefined };
    this.handleBudgetFieldChange = this.handleBudgetFieldChange.bind(this);
  }

  handleBudgetFieldChange(value) {
    this.setState({ budget: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction="column" gutter={16}>
          <Grid item>
            <FormControl fullWidth>
              <FormLabel>{"What is your organization's annual budget (in USD) for the current and two previous years?"}</FormLabel>
              <div style={{ padding: 20, backgroundColor: 'lightGrey' }}>
                <Grid item>
                  <Grid container direction="column" gutter={16}>
                    <Grid item>
                      <Grid container direction="row">
                        <Grid item sm={6} xs={12}>
                          <SelectForm
                            fieldName="budget"
                            label="This Year's Budget"
                            values={BUDGET_VALUES}
                            onFieldChange={this.handleBudgetFieldChange}
                            infoIcon
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row">
                        <Grid item sm={6} xs={12}>
                          <SelectForm
                            fieldName="lastYearBudget"
                            label="Last Year's Budget"
                            values={BUDGET_VALUES}
                            onFieldChange={this.handleBudgetFieldChange}
                            infoIcon
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row">
                        <Grid item sm={6} xs={12}>
                          <SelectForm
                            fieldName="twoYearsbudget"
                            label="Year before last's Budget"
                            values={BUDGET_VALUES}
                            onFieldChange={this.handleBudgetFieldChange}
                            infoIcon
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </FormControl>
          </Grid>
          <Grid item sm={12} xs={12}>
            <TextFieldForm
              label="Please state your souce(s) of core funding"
              placeholder="200 character maximum"
              fieldName="fundingDescription"
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
  }
}

export default PartnerProfileFundingBudget;
