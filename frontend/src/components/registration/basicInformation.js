import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../forms/radioForm'
import SelectForm from '../forms/selectForm'
import TextFieldForm from '../forms/textFieldForm'


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

class BasicInformation extends Component {

  constructor(props) {
    super(props);
    this.state = { legalNameChange: undefined };
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(value) {
    this.setState({ legalNameChange: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <TextFieldForm
            label="Organization's Legal Name"
            fieldName='legalName'
          />
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Alias (optional)"
              fieldName='legalNameAlias'
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='legalNameChange'
              label='Has the Organization had a legal name change?'
              values={NAME_CHANGE}
              onFieldChange={this.handleFieldChange}
            />
          </Grid>
          {this.state.legalNameChange === 'yes' &&
            (<TextFieldForm
              label="Organization's former Legal Name"
              fieldName='formerLegalName'
            />)}
          <SelectForm
            fieldName='country'
            label='Country of Origin'
            values={COUNTRY_MENU}
            infoIcon
          />
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Head of Organization's First Name"
                  placeholder='Provide First Name'
                  fieldName='headFirstName'
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextFieldForm
                  label="Head of Organization's Last Name"
                  placeholder='Provide Last Name'
                  fieldName='headLastName'
                />
              </Grid>
            </Grid>
          </Grid>
           <Grid item sm={6} xs={12}>
          <TextFieldForm
            label="Head of Organization's Email"
            placeholder='Provide Email'
            fieldName='headEmail'
          />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default BasicInformation;
