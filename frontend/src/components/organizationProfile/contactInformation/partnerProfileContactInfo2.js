import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'


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

const ADDRESS_VALUES = [
  {
    value: 'street',
    label: 'Street Address'
  },
  {
    value: 'po',
    label: 'PO Box'
  },
]

class PartnerProfileContactInfo2 extends Component {

  constructor(props) {
    super(props);
    this.state = { addressType: undefined, country: undefined };
    this.handleAddressFieldChange = this.handleAddressFieldChange.bind(this);
    this.handleCountryFieldChange = this.handleCountryFieldChange.bind(this);
  }

  handleAddressFieldChange(value) {
    this.setState({ addressType: value });
  }

  handleCountryFieldChange(value) {
    this.setState({ country: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='addressType'
              label='Type of Mailing Address'
              values={ADDRESS_VALUES}
              onFieldChange={this.handleAddressFieldChange}
            />
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Street Address"
                  placeholder=''
                  fieldName='streetAddress'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="City"
                  placeholder=''
                  fieldName='city'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <SelectForm
                  fieldName='country'
                  label='Country'
                  values={COUNTRY_MENU}
                  onFieldChange={this.handleCountryFieldChange}
                  infoIcon
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Zip Code (optional)"
                  placeholder=''
                  fieldName='zipCode'
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Telephone"
                  placeholder=''
                  fieldName='telephone'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Fax"
                  placeholder=''
                  fieldName='fax'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Website (optional)"
                  placeholder=''
                  fieldName='website'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Organization Email (optional)"
                  placeholder=''
                  fieldName='orgEmail'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileContactInfo2;
