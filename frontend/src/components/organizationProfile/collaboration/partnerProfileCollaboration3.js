import React, { Component } from 'react';

import Grid from 'material-ui/Grid';

import RadioForm from '../../forms/radioForm'
import SelectForm from '../../forms/selectForm'
import TextFieldForm from '../../forms/textFieldForm'

const DONORS_MENU = [
  {
    value: '1',
    label: 'Individuals'
  },
  {
    value: '2',
    label: 'United Nations Agency'
  },
  {
    value: '3',
    label: 'Governments'
  }
]

class PartnerProfileCollaboration3 extends Component {

  constructor(props) {
    super(props);
    this.state = { donors: undefined };
    this.handleDonorFieldChange = this.handleDonorFieldChange.bind(this);
  }

  handleDonorFieldChange(value) {
    this.setState({ donors: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item>
            <SelectForm
              fieldName='donors'
              label='Please select the type of donors that fund your agency'
              values={DONORS_MENU}
              onFieldChange={this.handleDonorFieldChange}
              infoIcon
            />
          </Grid>
        </Grid>
      </Grid>
    )
  }
};

export default PartnerProfileCollaboration3;
