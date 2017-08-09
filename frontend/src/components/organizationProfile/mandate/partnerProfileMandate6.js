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

class PartnerProfileMandate6 extends Component {

  constructor(props) {
    super(props);
    this.state = { countries: undefined };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleCountryFieldChange(value) {
    this.setState({ countries: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <SelectForm
              fieldName='languages'
              label='Select the countries in which the organization operates'
              values={COUNTRY_MENU}
              onFieldChange={this.handleCountryFieldChange}
              infoIcon
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileMandate6;
