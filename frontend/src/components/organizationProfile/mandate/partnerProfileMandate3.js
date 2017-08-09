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

class PartnerProfileMandate3 extends Component {

  constructor(props) {
    super(props);
    this.state = { hasAbuseSafeguard: undefined, hasFraudSafeguard: undefined };
    this.handleBoDFieldChange = this.handleBoDFieldChange.bind(this);
    this.handleAuthorisedOfficerFieldChange = this.handleAuthorisedOfficerFieldChange.bind(this);
  }

  handleAbuseSafeguardFieldChange(value) {
    this.setState({ hasAbuseSafeguard: value });
  }

  handleFraudSafeguardFieldChange(value) {
    this.setState({ hasFraudSafeguard: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='hasAbuseSafeguard'
                  label='Does the organization have a policy or code of conduct to safegaurd against the violation and abuse of beneficiaries?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleAbuseSafeguardFieldChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Please comment"
                  placeholder=''
                  fieldName='abuseSafeguardComment'
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
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='hasFraudSafeguard'
                  label='Does the organization have a policy or code of conduct to safegaurd against fraud and corruption?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleFraudSafeguardFieldChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Please comment"
                  placeholder=''
                  fieldName='fraudSafeguardComment'
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
      </Grid>

    )
  }
};

export default PartnerProfileMandate3;
