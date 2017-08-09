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

class PartnerProfileMandate1 extends Component {

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
              label="Briefly state the background and rationale for the establishment of the organization"
              placeholder='Please limit your response to 400 characters'
              fieldName='background'
              textFieldProps={{
                inputProps: {
                  maxLength:'400'
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextFieldForm
              label="Briefly state the mandate and mission of the organization"
              placeholder='Please limit your response to 400 characters'
              fieldName='mandate'
              textFieldProps={{
                inputProps: {
                  maxLength:'400'
                }
              }}
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileMandate1;
