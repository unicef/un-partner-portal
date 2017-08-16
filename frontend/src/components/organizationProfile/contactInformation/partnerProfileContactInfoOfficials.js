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

class PartnerProfileContactInfoOfficials extends Component {

  constructor(props) {
    super(props);
    this.state = { hasBoD: undefined, authorisedOfficer: undefined };
    this.handleBoDFieldChange = this.handleBoDFieldChange.bind(this);
    this.handleAuthorisedOfficerFieldChange = this.handleAuthorisedOfficerFieldChange.bind(this);
  }

  handleBoDFieldChange(value) {
    this.setState({ hasBoD: value });
  }

  handleAuthorisedOfficerFieldChange(value) {
    this.setState({ authorisedOfficer: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='hasBoD'
              label='Does your Organization have a Board of Directors?'
              values={BOOL_VAL}
              onFieldChange={this.handleBoDFieldChange}
            />
          </Grid>

          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="First Name"
                  placeholder=''
                  fieldName='firstName'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Last Name"
                  placeholder=''
                  fieldName='lastName'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Job Title/Position"
                  placeholder=''
                  fieldName='job'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='isAuthorisedOfficer'
                  label='Authorised Officer?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleAuthorisedOfficerFieldChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="First Name"
                  placeholder=''
                  fieldName='firstName'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Last Name"
                  placeholder=''
                  fieldName='lastName'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Job Title/Position"
                  placeholder=''
                  fieldName='job'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileContactInfoOfficials;
