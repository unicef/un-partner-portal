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

class PartnerProfileProjectImplementationManagement extends Component {

  constructor(props) {
    super(props);
    this.state = { approach: undefined, authorisedOfficer: undefined };
    this.handleApproachFieldChange = this.handleApproachFieldChange.bind(this);
    this.handleAuthorisedOfficerFieldChange = this.handleAuthorisedOfficerFieldChange.bind(this);
  }

  handleApproachFieldChange(value) {
    this.setState({ hasBoD: value });
  }

  handleAuthorisedOfficerFieldChange(value) {
    this.setState({ authorisedOfficer: value });
  }

  render() {
    return (
      <Grid item>
        <Grid container direction='column' gutter={16}>
          <Grid item sm={6} xs={12}>
            <RadioForm
              fieldName='approach'
              label='Do you use a results-based approach to managing programmes and projects?'
              values={BOOL_VAL}
              onFieldChange={this.handleApproachFieldChange}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextFieldForm
              label="Please provide a brief description of your management approach"
              placeholder='200 character maximum'
              fieldName='approachDescription'
              textFieldProps={{
                inputProps: {
                  maxLength:'200'
                }
              }}
            />
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='approach'
                  label='Does your organization have a system for monitoring and evaluating its projects & programmes?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleApproachFieldChange}
                />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextFieldForm
                    label="Briefly explain your M&E system"
                    placeholder='200 character maximum'
                    fieldName='approachDescription'
                    textFieldProps={{
                      inputProps: {
                        maxLength:'200'
                      }
                    }}
                  />
                </Grid>
              </Grid>
          </Grid>
          <Grid item>
            <Grid container direction='row'>
              <Grid item sm={6} xs={12}>
                <RadioForm
                  fieldName='approach'
                  label='Does the organization have systems or procedures in place for beneficaries to provide feedback on prject activities?'
                  values={BOOL_VAL}
                  onFieldChange={this.handleApproachFieldChange}
                />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextFieldForm
                    label="Briefly explain your feedback mechanism"
                    placeholder='200 character maximum'
                    fieldName='approachDescription'
                    textFieldProps={{
                      inputProps: {
                        maxLength:'200'
                      }
                    }}
                  />
                </Grid>
              </Grid>
          </Grid>
        </Grid>
      </Grid>

    )
  }
};

export default PartnerProfileProjectImplementationManagement;