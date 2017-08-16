import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'


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

class PartnerProfileIdentificationBasicInfo extends Component {

  constructor(props) {
    super(props);
    this.state = { legalNameChange: undefined, organization: undefined, staff: undefined };
    this.handleLegalFieldChange = this.handleLegalFieldChange.bind(this);
    this.handleOrgFieldChange = this.handleOrgFieldChange.bind(this);
  }

  handleLegalFieldChange(value) {
    this.setState({ legalNameChange: value });
  }

  handleOrgFieldChange(value) {
    this.setState({ organization: value });
  }

  handleStaffFieldChange(value) {
    this.setState({ staff: value });
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
              onFieldChange={this.handleLegalFieldChange}
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
          <Grid item sm={6} xs={12}>
            <SelectForm
              fieldName='organizationType'
              label='Type of organization'
              values={ORG_VALUES}
              onFieldChange={this.handleOrgFieldChange}
              infoIcon
            />
          </Grid>
          <Grid item sm={6} xs={12}>
          <SelectForm
              fieldName='staffCount'
              label='Total Number of Staff'
              values={STAFF_VALUES}
              onFieldChange={this.handleStaffFieldChange}
              infoIcon
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileIdentificationBasicInfo;
