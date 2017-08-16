import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const COMMUNICATION_VALUES = [
  {
    value: '1',
    label: 'Through the UNPP'
  },
  {
    value: '2',
    label: 'Email'
  },
  {
    value: '3',
    label: 'Telephone'
  },
  {
    value: '4',
    label: 'Letter'
  },
]

class PartnerProfileMandateGovernance extends Component {

  constructor(props) {
    super(props);
    this.state = { communicationMode: undefined};
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(value) {
    this.setState({ communicationMode: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <TextFieldForm
              label="Briefly describe the organization's governance structure"
              placeholder='Please limit your response to 200 characters'
              fieldName='structure'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Briefly describe the headquarters' oversight of country/branch office operations including anf reporting requirements of the country/branch offices to HQ"
              placeholder='Please limit your response to 200 characters'
              fieldName='oversight'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Your most up-to-date organigram"
              placeholder='Upload File'
              fieldName='organigram'
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileMandateGovernance;