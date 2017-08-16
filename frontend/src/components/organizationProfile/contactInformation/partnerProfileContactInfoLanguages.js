import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const COUNTRY_MENU = [
  {
    value: 'fr',
    label: 'French'
  },
  {
    value: 'it',
    label: 'Italian'
  }
]

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

class PartnerProfileContactInfoLanguages extends Component {

  constructor(props) {
    super(props);
    this.state = { languages: undefined };
    this.handleLanguagesFieldChange = this.handleLanguagesFieldChange.bind(this);
  }

  handleLanguagesFieldChange(value) {
    this.setState({ languages: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='row'>
          <Grid item sm={6} xs={12}>
            <SelectForm
              fieldName='languages'
              label='Working Language(s) of your Organization'
              values={COUNTRY_MENU}
              onFieldChange={this.handleLanguagesFieldChange}
              selectFieldProps={{
                              multiple: true
                            }}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Please State"
              placeholder='Additional languages known'
              fieldName='extraLanguage'
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default PartnerProfileContactInfoLanguages;
