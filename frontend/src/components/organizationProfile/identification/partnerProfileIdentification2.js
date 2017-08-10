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

const YEAR_MENU = [
  {
    value: '2017',
    label: '2017'
  },
  {
    value: '2016',
    label: '2016'
  }
]

const ORG_VALUES = [
  {
    value: 'ngo',
    label: 'National NGO'
  },
  {
    value: 'ingo',
    label: 'International NGO (INGO)'
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

class PartnerProfileIdentification2 extends Component {

  constructor(props) {
    super(props);
    this.state = { hasGoverningDocument: undefined, registered: undefined, staff: undefined };
    this.handleGoverningFieldChange = this.handleGoverningFieldChange.bind(this);
    this.handleRegistrationFieldChange = this.handleRegistrationFieldChange.bind(this);
  }

  handleGoverningFieldChange(value) {
    this.setState({ hasGoverningDocument: value });
  }

  handleRegistrationFieldChange(value) {
    this.setState({ registered: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <SelectForm
                  fieldName='yearOfEstablishment'
                  label='Year of Establishment in Country of Origin'
                  values={YEAR_MENU}
                  infoIcon
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='hasGoverningDocument'
                  label='Does the Organization have a Governing Document?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleGoverningFieldChange}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Governing Document"
                  placeholder='Upload File'
                  fieldName='governingDocument'
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='isRegistered'
              label='Is the Organization Registered in the Country of Origin?'
              values={BOOL_VAL}
              onFieldChange={this.handleRegistrationFieldChange}
            />
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <SelectForm
                  fieldName='registrationDate'
                  label='Registration Date'
                  values={YEAR_MENU}
                  infoIcon
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Registration Number (optional)"
                  placeholder=''
                  fieldName='registrationNumber'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Registration Document"
                  placeholder='Upload File'
                  fieldName='registrationDocument'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileIdentification2;
