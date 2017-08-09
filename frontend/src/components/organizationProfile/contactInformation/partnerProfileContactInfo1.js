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

class PartnerProfileContactInfo1 extends Component {

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
          <Grid item sm={6} xs={12}>
            <RadioForm
                fieldName='communicationMode'
                label='What is your preferred mode of conversation?'
                values={COMMUNICATION_VALUES}
                onFieldChange={this.handleFieldChange}
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileContactInfo1;
