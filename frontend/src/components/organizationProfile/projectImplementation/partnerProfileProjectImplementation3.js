import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

import Grid from 'material-ui/Grid';

import { FormControl, FormLabel } from 'material-ui/Form';

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

const NAME_CHANGE = [
  {
    value: 'yes',
    label: 'Yes'
  },
  {
    value: 'no',
    label: 'No'
  }
]

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'France'
  },
  {
    value: 'it',
    label: 'Italy'
  }
]

const BUDGET_VALUES = [
  {
    value: '1',
    label: '0 to 200,000'
  },
  {
    value: '2',
    label: '200,000 to 500,000'
  },
  {
    value: '3',
    label: '500,000 to 1,000,000'
  },
  {
    value: '4',
    label: '1,000,000 to 2,000,000'
  },
]

const STAFF_VALUES = [
  {
    value: '1',
    label: '1-10'
  },
  {
    value: '2',
    label: '11-50'
  },
  {
    value: '3',
    label: '51-100'
  },
  {
    value: '4',
    label: '101-200'
  },
]

class PartnerProfileProjectImplementation3 extends Component {

  constructor(props) {
    super(props);
    this.state = { procurementSegregated: undefined, authorizationSegregated: undefined, transactionRecordingSegregated: undefined, adequateStaff: undefined, documentedHR: undefined, documentedProcurement: undefined };
    this.handleProcurementFieldChange = this.handleProcurementFieldChange.bind(this);
    this.handleAuthorizationFieldChange = this.handleAuthorizationFieldChange.bind(this);
    this.handleTransactionFieldChange = this.handleTransactionFieldChange.bind(this);
    this.handleAdequateStaffFieldChange = this.handleAdequateStaffFieldChange.bind(this);
    this.handleHRFieldChange = this.handleHRFieldChange.bind(this);
    this.handleDocumentedProcurementFieldChange = this.handleDocumentedProcurementFieldChange.bind(this);
  }

  handleProcurementFieldChange(value) {        
    this.setState({ procurementSegregated: value });
  }

  handleAuthorizationFieldChange(value) {        
    this.setState({ authorizationSegregated: value });
  }

  handleTransactionFieldChange(value) {        
    this.setState({ transactionRecordingSegregated: value });
  }

  handleAdequateStaffFieldChange(value) {        
      this.setState({ adequateStaff: value });
    }

  handleHRFieldChange(value) {        
    this.setState({ documentedHR: value });
  }

  handleDocumentedProcurementFieldChange(value) {        
      this.setState({ documentedProcurement: value });
    }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <FormLabel>{"For each of the following areas of responsibility has the organization instituted safeguards to ensure the following functional responsibilities are appropriately segregated?"}</FormLabel>
          </Grid>
          <Grid item>
            <Paper elevation={4}>
              <Grid container direction='column'>
                <Grid item>
                  <Grid container direction='column'>
                    <Grid item sm={6} xs={12}>
                      <RadioForm
                        fieldName='procurementSegregated'
                        label="Procurement"
                        values={BOOL_VAL}
                        onFieldChange={this.handleProcurementFieldChange}
                        infoIcon
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Please comment"
                        placeholder='200 character maximum'
                        fieldName='procurementDescription'
                        textFieldProps={{
                          inputProps: {
                            maxLength:'200'
                          }
                        }}
                      />
                    </Grid>
                    <div />
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction='column'>
                    <Grid item sm={6} xs={12}>
                      <RadioForm
                        fieldName='authorizationSegregated'
                        label="Authorization to execute a transaction"
                        values={BOOL_VAL}
                        onFieldChange={this.handleAuthorizationFieldChange}
                        infoIcon
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Please comment"
                        placeholder='200 character maximum'
                        fieldName='authorizationDescription'
                        textFieldProps={{
                          inputProps: {
                            maxLength:'200'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction='column'>
                    <Grid item sm={6} xs={12}>
                      <RadioForm
                        fieldName='transactionRecordingSegregated'
                        label="Recording of a transaction"
                        values={BOOL_VAL}
                        onFieldChange={this.handleTransactionFieldChange}
                        infoIcon
                      />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextFieldForm
                        label="Please comment"
                        placeholder='200 character maximum'
                        fieldName='transactionDescription'
                        textFieldProps={{
                          inputProps: {
                            maxLength:'200'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='adequateStaff'
                  label="Does the organization have an adequate number of experienced staff responsible for financial management?"
                  values={BOOL_VAL}
                  onFieldChange={this.handleAdequateStaffFieldChange}
                  infoIcon
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Please comment"
                  placeholder='200 character maximum'
                  fieldName='staffDescription'
                  textFieldProps={{
                    inputProps: {
                      maxLength:'200'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <FormLabel>{"Does the organization have formal documented policies applicable to all operations that cover the following policy areas?"}</FormLabel>
          </Grid>
          <Grid item>
            <Paper elevation={4}>
              <Grid container direction='column'>
                <Grid item sm={6} xs={12}>
                  <RadioForm
                    fieldName='documentedHR'
                    label="Human Resources"
                    values={BOOL_VAL}
                    onFieldChange={this.handleHRFieldChange}
                    infoIcon
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <RadioForm
                    fieldName='documentedProcurement'
                    label="Procurement"
                    values={BOOL_VAL}
                    onFieldChange={this.handleDocumentedProcurementFieldChange}
                    infoIcon
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default PartnerProfileProjectImplementation3;
