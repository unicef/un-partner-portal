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

const GROUP_VALUES = [
  {
    value: '1',
    label: 'Refugees'
  },
  {
    value: '2',
    label: 'Asylum Seekers'
  },
  {
    value: '3',
    label: 'Stateless'
  },
  {
    value: '4',
    label: 'Orphans'
  },
]

class PartnerProfileMandate5 extends Component {

  constructor(props) {
    super(props);
    this.state = { popOfConcernWork: undefined, groups: undefined };
    this.handleConcernFieldChange = this.handleConcernFieldChange.bind(this);
    this.handleGroupFieldChange = this.handleGroupFieldChange.bind(this);
  }

  handleConcernFieldChange(value) {
    this.setState({ popOfConcernWork: value });
  }

  handleGroupFieldChange(value) {
    this.setState({ groups: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='popOfConcernWork'
              label='Does your organization work with populations of concern as defined by UNHCR'
              values={BOOL_VAL}
              onFieldChange={this.handleConcernFieldChange}
            />
          </Grid>
          <Grid item>
            <SelectForm
              fieldName='languages'
              label='Please indicate which group(s)'
              values={GROUP_VALUES}
              onFieldChange={this.handleGroupFieldChange}
              selectFieldProps={{
                              multiple: true
                            }}
            />
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileMandate5;
